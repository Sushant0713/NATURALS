import type { Document, Types } from 'mongoose';

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product?: Types.ObjectId;
  catalogueProductId?: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
