import type { Document, Types } from 'mongoose';

import type { CouponType } from '@/constants/enums.js';

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories: Types.ObjectId[];
  applicableProducts: Types.ObjectId[];
  isValid?: boolean;
  remainingUses?: number;
  createdAt: Date;
  updatedAt: Date;
}
