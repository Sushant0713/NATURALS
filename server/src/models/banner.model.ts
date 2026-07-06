import { model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { IBanner } from '@/types/models/banner.types.js';

const bannerSchema = createSchema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    linkUrl: {
      type: String,
      trim: true,
      maxlength: [500, 'Link URL cannot exceed 500 characters'],
    },
    linkLabel: {
      type: String,
      trim: true,
      maxlength: [50, 'Link label cannot exceed 50 characters'],
    },
    placement: {
      type: String,
      enum: ['hero', 'home', 'category', 'promo'],
      default: 'home',
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { collection: 'banners' }
);

bannerSchema.index({ isActive: 1, placement: 1, sortOrder: 1 });

export const Banner = model<IBanner>('Banner', bannerSchema);
