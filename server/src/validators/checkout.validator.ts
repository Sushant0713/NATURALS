import { z } from 'zod';

const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/),
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/),
  label: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  isDefault: z.boolean().optional(),
});

export const createAddressSchema = addressSchema;

export const updateAddressSchema = addressSchema.partial();

export const createCheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
        imageUrl: z.string().optional(),
      })
    )
    .min(1),
  shippingAddress: addressSchema.omit({ isDefault: true }),
  billingAddress: addressSchema.omit({ isDefault: true }).optional(),
  couponCode: z.string().trim().optional(),
  shippingMethod: z.enum(['standard', 'express']),
  notes: z.string().trim().max(500).optional(),
  saveAddress: z.boolean().optional(),
});

export const orderNumberParamSchema = z.object({
  orderNumber: z.string().min(1),
});
