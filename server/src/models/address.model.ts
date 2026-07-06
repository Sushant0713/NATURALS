import { Schema, model } from 'mongoose';

import { addressLabels } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import type { IAddress } from '@/types/models/address.types.js';

const addressSchema = createSchema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'addresses',
  }
);

addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

addressSchema.virtual('formattedAddress').get(function (this: IAddress) {
  const parts = [
    this.addressLine1,
    this.addressLine2,
    this.city,
    this.state,
    this.pincode,
  ].filter(Boolean);
  return parts.join(', ');
});

export const Address = model<IAddress>('Address', addressSchema);
