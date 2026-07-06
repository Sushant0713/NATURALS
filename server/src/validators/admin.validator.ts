import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  trackingNumber: z.string().trim().max(100).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(30).transform((v) => v.toUpperCase()),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();

export const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']).optional(),
});

export const updateReviewSchema = z.object({
  isApproved: z.boolean(),
});

export const createBlogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(10),
  coverImageUrl: z.string().trim().optional(),
  tags: z.array(z.string()).max(10).optional(),
  isPublished: z.boolean().optional(),
  metaTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(160).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const createBannerSchema = z.object({
  title: z.string().trim().min(2).max(150),
  subtitle: z.string().trim().max(300).optional(),
  imageUrl: z.string().trim().min(1),
  linkUrl: z.string().trim().max(500).optional(),
  linkLabel: z.string().trim().max(50).optional(),
  placement: z.enum(['hero', 'home', 'category', 'promo']).default('home'),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();

export const updateInventorySchema = z.object({
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export const createProductSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  isOrganic: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0).default(0),
  imageUrl: z.string().trim().optional(),
});

export const updateProductSchema = createProductSchema.partial();
