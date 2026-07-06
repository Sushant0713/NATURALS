import type { Document, Types } from 'mongoose';

import type { AuthProvider } from '@/constants/auth.js';
import type { UserRole } from '@/constants/enums.js';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email?: string;
  phone?: string;
  passwordHash?: string;
  googleId?: string;
  authProvider: AuthProvider;
  name: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  preferences?: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    smsNotifications: boolean;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
