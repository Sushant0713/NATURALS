import type { Document, Types } from 'mongoose';

import type { PaymentMethod, PaymentStatus } from '@/constants/enums.js';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  user?: Types.ObjectId;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  refundedAt?: Date;
  isPaid?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
