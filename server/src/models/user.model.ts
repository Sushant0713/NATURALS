import { model } from 'mongoose';

import { authProviders } from '@/constants/auth.js';
import { userRoles } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import type { IUser } from '@/types/models/user.types.js';

const userSchema = createSchema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },
    passwordHash: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: {
        values: Object.values(authProviders),
        message: 'Invalid auth provider',
      },
      default: authProviders.LOCAL,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(userRoles),
        message: 'Invalid user role',
      },
      default: userRoles.CUSTOMER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    collection: 'users',
  }
);

userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ googleId: 1 }, { sparse: true });

userSchema.virtual('displayName').get(function (this: IUser) {
  return this.name;
});

userSchema.pre('validate', function (next) {
  if (!this.email && !this.googleId) {
    this.invalidate('email', 'Either email or Google account is required');
  }
  next();
});

export const User = model<IUser>('User', userSchema);
