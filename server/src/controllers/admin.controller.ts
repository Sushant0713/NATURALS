import type { Request, Response } from 'express';

import {
  createAdminBanner,
  createAdminBlog,
  createAdminCategory,
  createAdminCoupon,
  createAdminProduct,
  deleteAdminBanner,
  deleteAdminBlog,
  deleteAdminCategory,
  deleteAdminCoupon,
  deleteAdminProduct,
  deleteAdminReview,
  getAnalytics,
  getDashboardStats,
  getReportsSummary,
  listAdminBanners,
  listAdminBlogs,
  listAdminCategories,
  listAdminCoupons,
  listAdminInventory,
  listAdminOrders,
  listAdminProducts,
  listAdminReviews,
  listAdminUsers,
  syncCatalogueProducts,
  updateAdminBanner,
  updateAdminBlog,
  updateAdminCategory,
  updateAdminCoupon,
  updateAdminInventory,
  updateAdminOrderStatus,
  updateAdminProduct,
  updateAdminReview,
  updateAdminUser,
} from '@/services/admin.service.js';
import { getUserById } from '@/services/auth.service.js';
import { userRoles } from '@/constants/enums.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { sendSuccess } from '@/utils/api-response.js';
import { toSafeUser } from '@/utils/user-mapper.js';

export const getAdminProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);
  return sendSuccess(res, {
    ...toSafeUser(user),
    permissions: {
      isAdmin: user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN,
      isSuperAdmin: user.role === userRoles.SUPER_ADMIN,
    },
  });
});

export const dashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await getDashboardStats());
});

export const analytics = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  return sendSuccess(res, await getAnalytics(days));
});

export const reportsSummary = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await getReportsSummary());
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const status = req.query.status as string | undefined;
  return sendSuccess(res, await listAdminOrders(page, limit, status));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminOrderStatus(
    String(req.params.id),
    req.body.status,
    req.body.trackingNumber
  );
  return sendSuccess(res, result);
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search as string | undefined;
  return sendSuccess(res, await listAdminProducts(page, limit, search));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdminProduct(req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminProduct(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminProduct(String(req.params.id));
  return sendSuccess(res, null, 'Product deactivated');
});

export const syncCatalogue = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await syncCatalogueProducts());
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await listAdminCategories());
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdminCategory(req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminCategory(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminCategory(String(req.params.id));
  return sendSuccess(res, null, 'Category deleted');
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search as string | undefined;
  return sendSuccess(res, await listAdminUsers(page, limit, search));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminUser(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const listInventory = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  return sendSuccess(res, await listAdminInventory(page, limit));
});

export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminInventory(
    String(req.params.productId),
    String(req.params.variantId),
    req.body
  );
  return sendSuccess(res, result);
});

export const listCoupons = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await listAdminCoupons());
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdminCoupon(req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminCoupon(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminCoupon(String(req.params.id));
  return sendSuccess(res, null, 'Coupon deactivated');
});

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const approved = req.query.approved === 'true' ? true : req.query.approved === 'false' ? false : undefined;
  return sendSuccess(res, await listAdminReviews(page, limit, approved));
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminReview(String(req.params.id), req.body.isApproved);
  return sendSuccess(res, result);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminReview(String(req.params.id));
  return sendSuccess(res, null, 'Review deleted');
});

export const listBlogs = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  return sendSuccess(res, await listAdminBlogs(page, limit));
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdminBlog(req.user!.id, req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminBlog(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminBlog(String(req.params.id));
  return sendSuccess(res, null, 'Blog deleted');
});

export const listBanners = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, await listAdminBanners());
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const result = await createAdminBanner(req.body);
  return sendSuccess(res, result, undefined, 201);
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateAdminBanner(String(req.params.id), req.body);
  return sendSuccess(res, result);
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  await deleteAdminBanner(String(req.params.id));
  return sendSuccess(res, null, 'Banner deleted');
});
