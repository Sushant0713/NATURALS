import { Schema, model } from 'mongoose';

import { paymentMethods, paymentStatuses } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import type { IPayment } from '@/types/models/payment.types.js';

const paymentSchema = createSchema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
      select: false,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      enum: {
        values: ['INR'],
        message: 'Only INR currency is supported',
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(paymentStatuses),
        message: 'Invalid payment status',
      },
      default: paymentStatuses.PENDING,
      index: true,
    },
    method: {
      type: String,
      enum: {
        values: Object.values(paymentMethods),
        message: 'Invalid payment method',
      },
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Failure reason cannot exceed 500 characters'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    paidAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    collection: 'payments',
  }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

paymentSchema.virtual('isPaid').get(function (this: IPayment) {
  return this.status === paymentStatuses.SUCCESS;
});

export const Payment = model<IPayment>('Payment', paymentSchema);
