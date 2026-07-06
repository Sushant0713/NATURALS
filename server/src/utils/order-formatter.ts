import { Order } from '@/models/order.model.js';
import { Payment } from '@/models/payment.model.js';

export function formatOrderResponse(
  order: InstanceType<typeof Order>,
  payment: InstanceType<typeof Payment>
) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.catalogueProductId,
      productName: item.productName,
      variantLabel: item.variantLabel,
      imageUrl: item.imageUrl,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      total: item.total,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    couponCode: order.couponCode,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    notes: order.notes,
    createdAt: order.createdAt,
    payment: {
      status: payment.status,
      method: payment.method,
      paidAt: payment.paidAt,
      amount: payment.amount,
    },
  };
}
