import type { Document, Types } from 'mongoose';

import type { OrderStatus } from '@/constants/enums.js';

export interface IOrderItem {
  _id: Types.ObjectId;
  product?: Types.ObjectId;
  variantId?: Types.ObjectId;
  catalogueProductId?: string;
  sku: string;
  productName: string;
  variantLabel: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface IAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  label: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon?: Types.ObjectId;
  couponCode?: string;
  shippingAddress: IAddressSnapshot;
  billingAddress?: IAddressSnapshot;
  notes?: string;
  trackingNumber?: string;
  itemCount?: number;
  totalQuantity?: number;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
