import type { Document, Types } from 'mongoose';

export interface IProductImage {
  _id: Types.ObjectId;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface IProductVariant {
  _id: Types.ObjectId;
  sku: string;
  label: string;
  weight?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLowStock?: boolean;
  discountPercentage?: number;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  features: string[];
  healthBenefits: string[];
  suitableFor: string[];
  ageGuidance?: string;
  ingredients?: string;
  howItsMade?: string;
  isGlutenFree: boolean;
  isOrganic: boolean;
  isBestseller: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  images: IProductImage[];
  variants: IProductVariant[];
  averageRating: number;
  reviewCount: number;
  startingPrice?: number;
  primaryImage?: string;
  reviews?: unknown[];
  createdAt: Date;
  updatedAt: Date;
}
