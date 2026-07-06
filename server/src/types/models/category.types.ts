import type { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
