import { Schema, model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { IRefreshToken } from '@/types/models/refresh-token.types.js';

const refreshTokenSchema = createSchema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
    },
    lookup: {
      type: String,
      required: [true, 'Token lookup is required'],
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: [500, 'User agent cannot exceed 500 characters'],
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: [45, 'IP address cannot exceed 45 characters'],
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    collection: 'refresh_tokens',
  }
);

refreshTokenSchema.index({ user: 1, isRevoked: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
