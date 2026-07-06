import { model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { ICategory } from '@/types/models/category.types.js';

const categorySchema = createSchema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, 'Sort order cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  {
    collection: 'categories',
  }
);

categorySchema.index({ isActive: 1, sortOrder: 1 });
categorySchema.index({ name: 'text', description: 'text' });

categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

export const Category = model<ICategory>('Category', categorySchema);
