import { Router } from 'express';

import {
  analytics,
  createBanner,
  createBlog,
  createCategory,
  createCoupon,
  createProduct,
  dashboardStats,
  deleteBanner,
  deleteBlog,
  deleteCategory,
  deleteCoupon,
  deleteProduct,
  deleteReview,
  getAdminProfile,
  listBanners,
  listBlogs,
  listCategories,
  listCoupons,
  listInventory,
  listOrders,
  listProducts,
  listReviews,
  listUsers,
  reportsSummary,
  syncCatalogue,
  updateBanner,
  updateBlog,
  updateCategory,
  updateCoupon,
  updateInventory,
  updateOrderStatus,
  updateProduct,
  updateReview,
  updateUser,
} from '@/controllers/admin.controller.js';
import { authenticate, requireAdmin } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import {
  createBannerSchema,
  createBlogSchema,
  createCategorySchema,
  createCouponSchema,
  createProductSchema,
  updateBannerSchema,
  updateBlogSchema,
  updateCategorySchema,
  updateCouponSchema,
  updateInventorySchema,
  updateOrderStatusSchema,
  updateProductSchema,
  updateReviewSchema,
  updateUserSchema,
} from '@/validators/admin.validator.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/me', getAdminProfile);
adminRouter.get('/dashboard', dashboardStats);
adminRouter.get('/analytics', analytics);
adminRouter.get('/reports', reportsSummary);

adminRouter.get('/orders', listOrders);
adminRouter.patch('/orders/:id/status', validate({ body: updateOrderStatusSchema }), updateOrderStatus);

adminRouter.get('/products', listProducts);
adminRouter.post('/products', validate({ body: createProductSchema }), createProduct);
adminRouter.post('/products/sync-catalogue', syncCatalogue);
adminRouter.patch('/products/:id', validate({ body: updateProductSchema }), updateProduct);
adminRouter.delete('/products/:id', deleteProduct);

adminRouter.get('/categories', listCategories);
adminRouter.post('/categories', validate({ body: createCategorySchema }), createCategory);
adminRouter.patch('/categories/:id', validate({ body: updateCategorySchema }), updateCategory);
adminRouter.delete('/categories/:id', deleteCategory);

adminRouter.get('/users', listUsers);
adminRouter.patch('/users/:id', validate({ body: updateUserSchema }), updateUser);

adminRouter.get('/inventory', listInventory);
adminRouter.patch(
  '/inventory/:productId/:variantId',
  validate({ body: updateInventorySchema }),
  updateInventory
);

adminRouter.get('/coupons', listCoupons);
adminRouter.post('/coupons', validate({ body: createCouponSchema }), createCoupon);
adminRouter.patch('/coupons/:id', validate({ body: updateCouponSchema }), updateCoupon);
adminRouter.delete('/coupons/:id', deleteCoupon);

adminRouter.get('/reviews', listReviews);
adminRouter.patch('/reviews/:id', validate({ body: updateReviewSchema }), updateReview);
adminRouter.delete('/reviews/:id', deleteReview);

adminRouter.get('/blogs', listBlogs);
adminRouter.post('/blogs', validate({ body: createBlogSchema }), createBlog);
adminRouter.patch('/blogs/:id', validate({ body: updateBlogSchema }), updateBlog);
adminRouter.delete('/blogs/:id', deleteBlog);

adminRouter.get('/banners', listBanners);
adminRouter.post('/banners', validate({ body: createBannerSchema }), createBanner);
adminRouter.patch('/banners/:id', validate({ body: updateBannerSchema }), updateBanner);
adminRouter.delete('/banners/:id', deleteBanner);
