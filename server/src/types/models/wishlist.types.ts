import type { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product?: Types.ObjectId;
  catalogueProductId?: string;
  createdAt: Date;
  updatedAt: Date;
}
