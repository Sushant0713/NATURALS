import { Schema, model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { IReview } from '@/types/models/review.types.js';

const reviewSchema = createSchema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      index: true,
    },
    catalogueProductId: {
      type: String,
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    collection: 'reviews',
  }
);

reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ catalogueProductId: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, catalogueProductId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ rating: 1 });

export const Review = model<IReview>('Review', reviewSchema);
