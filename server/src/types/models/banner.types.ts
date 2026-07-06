import type { Document, Types } from 'mongoose';

export type BannerPlacement = 'hero' | 'home' | 'category' | 'promo';

export interface IBanner extends Document {
  _id: Types.ObjectId;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  linkLabel?: string;
  placement: BannerPlacement;
  sortOrder: number;
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
