import { Schema, model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import {
  productImageSchema,
  productVariantSchema,
} from '@/models/schemas/shared.schemas.js';
import type { IProduct, IProductVariant } from '@/types/models/product.types.js';

const productSchema = createSchema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20,
        message: 'Cannot have more than 20 features',
      },
    },
    healthBenefits: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20,
        message: 'Cannot have more than 20 health benefits',
      },
    },
    suitableFor: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20,
        message: 'Cannot have more than 20 suitability entries',
      },
    },
    ageGuidance: {
      type: String,
      trim: true,
      maxlength: [100, 'Age guidance cannot exceed 100 characters'],
    },
    ingredients: {
      type: String,
      trim: true,
      maxlength: [2000, 'Ingredients cannot exceed 2000 characters'],
    },
    howItsMade: {
      type: String,
      trim: true,
      maxlength: [3000, "How it's made cannot exceed 3000 characters"],
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOrganic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title cannot exceed 70 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be negative'],
      max: [5, 'Average rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    images: {
      type: [productImageSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length <= 10,
        message: 'Cannot have more than 10 images',
      },
    },
    variants: {
      type: [productVariantSchema],
      default: [],
      validate: {
        validator: (value: unknown[]) => value.length >= 1,
        message: 'At least one variant is required',
      },
    },
  },
  {
    collection: 'products',
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, isBestseller: -1, createdAt: -1 });
productSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });

productSchema.virtual('startingPrice').get(function (this: IProduct) {
  const activeVariants = this.variants.filter((v) => v.isActive);
  if (activeVariants.length === 0) return undefined;
  return Math.min(...activeVariants.map((v) => v.price));
});

productSchema.virtual('primaryImage').get(function (this: IProduct) {
  const primary = this.images.find((img) => img.isPrimary);
  return primary?.url ?? this.images[0]?.url;
});

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

productVariantSchema.virtual('isLowStock').get(function (this: IProductVariant) {
  return this.stockQuantity <= this.lowStockThreshold;
});

productVariantSchema.virtual('discountPercentage').get(function (this: IProductVariant) {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

export const Product = model<IProduct>('Product', productSchema);
