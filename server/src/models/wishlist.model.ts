import { Schema, model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { IWishlist } from '@/types/models/wishlist.types.js';

const wishlistSchema = createSchema(
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
  },
  {
    collection: 'wishlists',
  }
);

wishlistSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
wishlistSchema.index({ user: 1, catalogueProductId: 1 }, { unique: true, sparse: true });
wishlistSchema.index({ user: 1, createdAt: -1 });

export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
