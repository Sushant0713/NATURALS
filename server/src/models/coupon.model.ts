import { Schema, model } from 'mongoose';

import { couponTypes } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import type { ICoupon } from '@/types/models/coupon.types.js';

const couponSchema = createSchema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      trim: true,
      uppercase: true,
      unique: true,
      minlength: [3, 'Coupon code must be at least 3 characters'],
      maxlength: [30, 'Coupon code cannot exceed 30 characters'],
      match: [/^[A-Z0-9_-]+$/, 'Coupon code can only contain letters, numbers, hyphens, and underscores'],
    },
    type: {
      type: String,
      enum: {
        values: Object.values(couponTypes),
        message: 'Invalid coupon type',
      },
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Coupon value cannot be negative'],
      validate: {
        validator: function (this: ICoupon, value: number) {
          if (this.type === couponTypes.PERCENTAGE) {
            return value > 0 && value <= 100;
          }
          return value > 0;
        },
        message: 'Percentage coupons must be between 1 and 100; fixed coupons must be greater than 0',
      },
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order amount cannot be negative'],
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Max discount cannot be negative'],
    },
    maxUses: {
      type: Number,
      min: [1, 'Max uses must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    validUntil: {
      type: Date,
      required: [true, 'Valid until date is required'],
      validate: {
        validator: function (this: ICoupon, value: Date) {
          return value > this.validFrom;
        },
        message: 'Valid until must be after valid from',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    applicableCategories: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
      default: [],
    },
    applicableProducts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
    },
  },
  {
    collection: 'coupons',
  }
);

couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ code: 1, isActive: 1 });

couponSchema.virtual('isValid').get(function (this: ICoupon) {
  const now = new Date();
  const withinDateRange = now >= this.validFrom && now <= this.validUntil;
  const hasUsesRemaining = this.maxUses === undefined || this.usedCount < this.maxUses;
  return this.isActive && withinDateRange && hasUsesRemaining;
});

couponSchema.virtual('remainingUses').get(function (this: ICoupon) {
  if (this.maxUses === undefined) return undefined;
  return Math.max(0, this.maxUses - this.usedCount);
});

export const Coupon = model<ICoupon>('Coupon', couponSchema);
