import type { Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  tokenHash: string;
  lookup: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
