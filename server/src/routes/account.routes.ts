import { Router } from 'express';

import {
  addWishlist,
  createAddressHandler,
  createReviewHandler,
  deleteAddressHandler,
  deleteReviewHandler,
  getAddresses,
  getCoupons,
  getNotifications,
  getOrder,
  getProfile,
  getReviews,
  getStats,
  getWishlist,
  listOrders,
  readAllNotifications,
  readNotification,
  removeWishlist,
  syncWishlistHandler,
  updateAddressHandler,
  updateProfile,
  updateSettings,
} from '@/controllers/account.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { createAddressSchema, updateAddressSchema } from '@/validators/checkout.validator.js';
import {
  createReviewSchema,
  syncWishlistSchema,
  updateProfileSchema,
  updateSettingsSchema,
  wishlistProductSchema,
} from '@/validators/account.validator.js';
import { orderNumberParamSchema } from '@/validators/checkout.validator.js';

export const accountRouter = Router();

accountRouter.use(authenticate);

accountRouter.get('/profile', getProfile);
accountRouter.patch('/profile', validate({ body: updateProfileSchema }), updateProfile);
accountRouter.patch('/settings', validate({ body: updateSettingsSchema }), updateSettings);
accountRouter.get('/stats', getStats);

accountRouter.get('/orders', listOrders);
accountRouter.get('/orders/:orderNumber', validate({ params: orderNumberParamSchema }), getOrder);

accountRouter.get('/wishlist', getWishlist);
accountRouter.post('/wishlist', validate({ body: wishlistProductSchema }), addWishlist);
accountRouter.post('/wishlist/sync', validate({ body: syncWishlistSchema }), syncWishlistHandler);
accountRouter.delete('/wishlist/:productId', removeWishlist);

accountRouter.get('/addresses', getAddresses);
accountRouter.post('/addresses', validate({ body: createAddressSchema }), createAddressHandler);
accountRouter.patch('/addresses/:id', validate({ body: updateAddressSchema }), updateAddressHandler);
accountRouter.delete('/addresses/:id', deleteAddressHandler);

accountRouter.get('/reviews', getReviews);
accountRouter.post('/reviews', validate({ body: createReviewSchema }), createReviewHandler);
accountRouter.delete('/reviews/:id', deleteReviewHandler);

accountRouter.get('/coupons', getCoupons);

accountRouter.get('/notifications', getNotifications);
accountRouter.patch('/notifications/read-all', readAllNotifications);
accountRouter.patch('/notifications/:id/read', readNotification);
