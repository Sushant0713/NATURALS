import type { Request, Response } from 'express';

import {
  addWishlistItem,
  createAccountReview,
  deleteAccountReview,
  createUserAddress,
  deleteUserAddress,
  getAccountProfile,
  getAccountStats,
  listAccountNotifications,
  listAccountOrders,
  listAccountReviews,
  listAccountWishlist,
  listAvailableCoupons,
  listUserAddresses,
  markAllNotificationsRead,
  markNotificationRead,
  removeWishlistItem,
  syncWishlist,
  updateAccountProfile,
  updateAccountSettings,
  updateUserAddress,
} from '@/services/account.service.js';
import { getOrderByNumber } from '@/services/checkout.service.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { sendSuccess } from '@/utils/api-response.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await getAccountProfile(req.user!.id);
  return sendSuccess(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await updateAccountProfile(req.user!.id, req.body);
  return sendSuccess(res, profile);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const profile = await updateAccountSettings(req.user!.id, req.body);
  return sendSuccess(res, profile);
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getAccountStats(req.user!.id);
  return sendSuccess(res, stats);
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await listAccountOrders(req.user!.id, page, limit);
  return sendSuccess(res, result);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderByNumber(req.user!.id, String(req.params.orderNumber));
  return sendSuccess(res, order);
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const items = await listAccountWishlist(req.user!.id);
  return sendSuccess(res, items);
});

export const addWishlist = asyncHandler(async (req: Request, res: Response) => {
  const item = await addWishlistItem(req.user!.id, req.body.catalogueProductId);
  return sendSuccess(res, item, undefined, 201);
});

export const removeWishlist = asyncHandler(async (req: Request, res: Response) => {
  await removeWishlistItem(req.user!.id, String(req.params.productId));
  return sendSuccess(res, null, 'Removed from wishlist');
});

export const syncWishlistHandler = asyncHandler(async (req: Request, res: Response) => {
  const items = await syncWishlist(req.user!.id, req.body.productIds);
  return sendSuccess(res, items);
});

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await listUserAddresses(req.user!.id);
  return sendSuccess(res, addresses);
});

export const createAddressHandler = asyncHandler(async (req: Request, res: Response) => {
  const address = await createUserAddress(req.user!.id, req.body);
  return sendSuccess(res, address, undefined, 201);
});

export const updateAddressHandler = asyncHandler(async (req: Request, res: Response) => {
  const address = await updateUserAddress(req.user!.id, String(req.params.id), req.body);
  return sendSuccess(res, address);
});

export const deleteAddressHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteUserAddress(req.user!.id, String(req.params.id));
  return sendSuccess(res, null, 'Address deleted');
});

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await listAccountReviews(req.user!.id);
  return sendSuccess(res, reviews);
});

export const createReviewHandler = asyncHandler(async (req: Request, res: Response) => {
  const review = await createAccountReview(req.user!.id, req.body);
  return sendSuccess(res, review, undefined, 201);
});

export const deleteReviewHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteAccountReview(req.user!.id, String(req.params.id));
  return sendSuccess(res, null, 'Review deleted');
});

export const getCoupons = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, listAvailableCoupons());
});

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await listAccountNotifications(req.user!.id, page, limit);
  return sendSuccess(res, result);
});

export const readNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await markNotificationRead(req.user!.id, String(req.params.id));
  return sendSuccess(res, result);
});

export const readAllNotifications = asyncHandler(async (req: Request, res: Response) => {
  await markAllNotificationsRead(req.user!.id);
  return sendSuccess(res, null, 'All notifications marked as read');
});
