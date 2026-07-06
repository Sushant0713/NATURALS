import { Schema, model } from 'mongoose';

import { orderStatuses } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import {
  addressSnapshotSchema,
  orderItemSchema,
} from '@/models/schemas/shared.schemas.js';
import type { IOrder } from '@/types/models/order.types.js';

const orderSchema = createSchema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      trim: true,
      uppercase: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    guestPhone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(orderStatuses),
        message: 'Invalid order status',
      },
      default: orderStatuses.PENDING,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: (value: unknown[]) => value.length >= 1,
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    shippingAddress: {
      type: addressSnapshotSchema,
      required: [true, 'Shipping address is required'],
    },
    billingAddress: {
      type: addressSnapshotSchema,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    trackingNumber: {
      type: String,
      trim: true,
      maxlength: [100, 'Tracking number cannot exceed 100 characters'],
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    collection: 'orders',
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ guestPhone: 1 });
orderSchema.index({ guestEmail: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('validate', function (next) {
  if (!this.user && !this.guestPhone && !this.guestEmail) {
    this.invalidate('user', 'Order must belong to a user or include guest contact information');
  }
  next();
});

orderSchema.virtual('itemCount').get(function (this: IOrder) {
  return this.items.length;
});

orderSchema.virtual('totalQuantity').get(function (this: IOrder) {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

orderSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'order',
  justOne: true,
});

export const Order = model<IOrder>('Order', orderSchema);
