import { Schema } from 'mongoose';

import { addressLabels } from '@/constants/enums.js';

export const addressSnapshotSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
      maxlength: [200, 'Address line 1 cannot exceed 200 characters'],
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address line 2 cannot exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit pincode'],
    },
    label: {
      type: String,
      enum: {
        values: Object.values(addressLabels),
        message: 'Invalid address label',
      },
      default: addressLabels.HOME,
    },
  },
  { _id: false }
);

export const productImageSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      maxlength: [200, 'Alt text cannot exceed 200 characters'],
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, 'Sort order cannot be negative'],
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

export const productVariantSchema = new Schema(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      uppercase: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
    },
    label: {
      type: String,
      required: [true, 'Variant label is required'],
      trim: true,
      maxlength: [50, 'Variant label cannot exceed 50 characters'],
    },
    weight: {
      type: String,
      trim: true,
      maxlength: [30, 'Weight cannot exceed 30 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      min: [0, 'Low stock threshold cannot be negative'],
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

export const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    variantId: {
      type: Schema.Types.ObjectId,
    },
    catalogueProductId: {
      type: String,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU snapshot is required'],
      trim: true,
      uppercase: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name snapshot is required'],
      trim: true,
    },
    variantLabel: {
      type: String,
      required: [true, 'Variant label snapshot is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    total: {
      type: Number,
      required: [true, 'Line total is required'],
      min: [0, 'Line total cannot be negative'],
    },
  },
  { _id: true }
);
