import { Types } from 'mongoose';

import { GST_RATE, shippingOptions, storeCoupons } from '@/constants/checkout.js';
import { getCatalogueName, getCataloguePrice } from '@/constants/catalogue.js';
import { orderStatuses, paymentStatuses } from '@/constants/enums.js';
import { Address } from '@/models/address.model.js';
import { Order } from '@/models/order.model.js';
import { Payment } from '@/models/payment.model.js';
import type { AuthUser } from '@/types/auth.js';
import type { IAddressSnapshot } from '@/types/models/order.types.js';
import { AppError } from '@/utils/app-error.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import { generateOrderNumber } from '@/utils/order-number.js';
import { createOrderNotification } from '@/services/notification.service.js';
import { formatOrderResponse } from '@/utils/order-formatter.js';
import {
  createCashfreeOrder,
  fetchCashfreeOrder,
  getCashfreeMode,
  mapCashfreeStatus,
} from '@/services/cashfree.service.js';
import { env } from '@/config/env.js';

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
  imageUrl?: string;
}

export interface CreateCheckoutInput {
  items: CheckoutItemInput[];
  shippingAddress: IAddressSnapshot;
  billingAddress?: IAddressSnapshot;
  couponCode?: string;
  shippingMethod: 'standard' | 'express';
  notes?: string;
  saveAddress?: boolean;
}

function calculateCouponDiscount(subtotal: number, couponCode?: string) {
  if (!couponCode) return { discount: 0, code: undefined as string | undefined };

  const coupon = storeCoupons.find((c) => c.code === couponCode.trim().toUpperCase());
  if (!coupon) {
    throw new AppError('Invalid coupon code', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`,
      httpStatus.BAD_REQUEST,
      errorCodes.BAD_REQUEST
    );
  }

  let discount =
    coupon.type === 'PERCENTAGE'
      ? (subtotal * coupon.value) / 100
      : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return { discount: Math.min(discount, subtotal), code: coupon.code };
}

function calculateShipping(subtotalAfterDiscount: number, method: 'standard' | 'express') {
  const option = shippingOptions[method];
  if (option.freeAbove !== null && subtotalAfterDiscount >= option.freeAbove) {
    return 0;
  }
  return option.price;
}

function buildOrderItems(items: CheckoutItemInput[]) {
  return items.map((item) => {
    const price = getCataloguePrice(item.productId);
    const name = getCatalogueName(item.productId);

    if (price === null || !name) {
      throw new AppError(`Invalid product: ${item.productId}`, httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
    }

    if (item.quantity < 1 || item.quantity > 99) {
      throw new AppError('Invalid quantity', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
    }

    return {
      catalogueProductId: item.productId,
      sku: item.productId.toUpperCase().replace(/-/g, '_'),
      productName: name,
      variantLabel: 'Standard',
      imageUrl: item.imageUrl,
      unitPrice: price,
      quantity: item.quantity,
      total: price * item.quantity,
    };
  });
}

export async function createCheckoutOrder(user: AuthUser, input: CreateCheckoutInput) {
  if (!input.items.length) {
    throw new AppError('Cart is empty', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  const orderItems = buildOrderItems(input.items);
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const { discount, code: couponCode } = calculateCouponDiscount(subtotal, input.couponCode);
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(subtotalAfterDiscount, input.shippingMethod);
  const taxableAmount = subtotalAfterDiscount + shipping;
  const tax = Math.round(taxableAmount * GST_RATE);
  const total = taxableAmount + tax;

  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: new Types.ObjectId(user.id),
    status: orderStatuses.PENDING,
    items: orderItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    couponCode,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress ?? input.shippingAddress,
    notes: input.notes,
  });

  const payment = await Payment.create({
    order: order._id,
    user: new Types.ObjectId(user.id),
    amount: total,
    currency: 'INR',
    status: paymentStatuses.PENDING,
    metadata: {
      shippingMethod: input.shippingMethod,
      cashfreeMode: getCashfreeMode(),
    },
  });

  if (input.saveAddress) {
    await saveAddressIfNew(user.id, input.shippingAddress);
  }

  const returnUrl = `${env.APP_URL}/checkout/success?order_number=${orderNumber}`;
  const notifyUrl = `${env.APP_URL.replace('3000', '4000')}${env.API_PREFIX}/checkout/webhook`;

  const cashfree = await createCashfreeOrder({
    orderId: orderNumber,
    amount: total,
    customer: {
      customerId: user.id,
      customerName: input.shippingAddress.fullName,
      customerEmail: user.email ?? `${user.id}@raanjaai.local`,
      customerPhone: input.shippingAddress.phone,
    },
    returnUrl,
    notifyUrl,
  });

  payment.metadata = {
    ...payment.metadata,
    cashfreeOrderId: cashfree.orderId,
    cfOrderId: cashfree.cfOrderId,
    paymentSessionId: cashfree.paymentSessionId,
    mock: cashfree.mock ?? false,
  };
  await payment.save();

  return {
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    paymentSessionId: cashfree.paymentSessionId,
    cashfreeMode: getCashfreeMode(),
    mock: cashfree.mock ?? false,
    total,
    subtotal,
    discount,
    shipping,
    tax,
  };
}

async function saveAddressIfNew(userId: string, snapshot: IAddressSnapshot) {
  const exists = await Address.findOne({
    user: userId,
    addressLine1: snapshot.addressLine1,
    pincode: snapshot.pincode,
  });

  if (!exists) {
    await Address.create({
      user: userId,
      ...snapshot,
      isDefault: (await Address.countDocuments({ user: userId })) === 0,
    });
  }
}

export async function verifyCheckoutPayment(userId: string, orderNumber: string) {
  const order = await Order.findOne({ orderNumber, user: userId });
  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  const payment = await Payment.findOne({ order: order._id });
  if (!payment) {
    throw new AppError('Payment not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  if (payment.status === paymentStatuses.SUCCESS) {
    return formatOrderResponse(order, payment);
  }

  const cashfreeOrderId = (payment.metadata?.cashfreeOrderId as string) ?? orderNumber;
  const isMock = Boolean(payment.metadata?.mock);

  const cfOrder = await fetchCashfreeOrder(cashfreeOrderId);
  const mapped = isMock ? 'SUCCESS' : mapCashfreeStatus(cfOrder.order_status);

  if (mapped === 'SUCCESS') {
    payment.status = paymentStatuses.SUCCESS;
    payment.paidAt = new Date();
    payment.metadata = {
      ...payment.metadata,
      cashfreeStatus: cfOrder.order_status,
    };
    await payment.save();

    order.status = orderStatuses.CONFIRMED;
    await order.save();

    if (order.user) {
      await createOrderNotification(order.user.toString(), order.orderNumber, order.total);
    }
  } else if (mapped === 'FAILED') {
    payment.status = paymentStatuses.FAILED;
    payment.failureReason = cfOrder.order_status;
    await payment.save();

    order.status = orderStatuses.CANCELLED;
    order.cancelledAt = new Date();
    await order.save();
  }

  return formatOrderResponse(order, payment);
}

export async function getOrderByNumber(userId: string, orderNumber: string) {
  const order = await Order.findOne({ orderNumber, user: userId });
  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  const payment = await Payment.findOne({ order: order._id });
  if (!payment) {
    throw new AppError('Payment not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  return formatOrderResponse(order, payment);
}
