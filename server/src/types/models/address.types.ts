import type { Document, Types } from 'mongoose';

import type { AddressLabel } from '@/constants/enums.js';

export interface IAddress extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  label: AddressLabel;
  isDefault: boolean;
  formattedAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
