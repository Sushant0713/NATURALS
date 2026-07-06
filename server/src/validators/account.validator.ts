import { z } from 'zod';

const preferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  orderUpdates: z.boolean().optional(),
  promotions: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const updateSettingsSchema = z.object({
  preferences: preferencesSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .optional(),
});

export const createReviewSchema = z.object({
  catalogueProductId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(150).optional(),
  comment: z.string().trim().max(2000).optional(),
});

export const wishlistProductSchema = z.object({
  catalogueProductId: z.string().min(1),
});

export const syncWishlistSchema = z.object({
  productIds: z.array(z.string().min(1)),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
