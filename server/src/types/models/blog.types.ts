import type { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  author: Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
  estimatedReadTime?: number;
  createdAt: Date;
  updatedAt: Date;
}
