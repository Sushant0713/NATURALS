import { storeCoupons } from '@/constants/checkout.js';
import {
  catalogueProductNames,
  catalogueProductPrices,
  getCatalogueName,
} from '@/constants/catalogue.js';
import { Notification } from '@/models/notification.model.js';
import { Order } from '@/models/order.model.js';
import { Payment } from '@/models/payment.model.js';
import { Review } from '@/models/review.model.js';
import { User } from '@/models/user.model.js';
import { Wishlist } from '@/models/wishlist.model.js';
import { createWelcomeNotification } from '@/services/notification.service.js';
import { AppError } from '@/utils/app-error.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import { formatOrderResponse } from '@/utils/order-formatter.js';
import { comparePassword, hashPassword } from '@/utils/password.js';
import { toSafeUser } from '@/utils/user-mapper.js';

const defaultPreferences = {
  emailNotifications: true,
  orderUpdates: true,
  promotions: true,
  smsNotifications: false,
};

export async function getAccountProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  await createWelcomeNotification(userId, user.name);

  return {
    ...toSafeUser(user),
    preferences: user.preferences ?? defaultPreferences,
  };
}

export async function updateAccountProfile(
  userId: string,
  input: { name?: string; phone?: string; avatarUrl?: string }
) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  if (input.phone && input.phone !== user.phone) {
    const existing = await User.findOne({ phone: input.phone, _id: { $ne: userId } });
    if (existing) {
      throw new AppError('Phone number already in use', httpStatus.CONFLICT, errorCodes.CONFLICT);
    }
    user.phone = input.phone;
  }

  if (input.name) user.name = input.name;
  if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl;

  await user.save();
  return { ...toSafeUser(user), preferences: user.preferences ?? defaultPreferences };
}

export async function updateAccountSettings(
  userId: string,
  input: {
    preferences?: Partial<typeof defaultPreferences>;
    currentPassword?: string;
    newPassword?: string;
  }
) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  if (input.newPassword) {
    if (!input.currentPassword || !user.passwordHash) {
      throw new AppError('Current password is required', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
    }
    const valid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!valid) {
      throw new AppError('Current password is incorrect', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
    }
    user.passwordHash = await hashPassword(input.newPassword);
  }

  if (input.preferences) {
    user.preferences = { ...defaultPreferences, ...user.preferences, ...input.preferences };
  }

  await user.save();
  return { ...toSafeUser(user), preferences: user.preferences ?? defaultPreferences };
}

export async function listAccountOrders(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ user: userId }),
  ]);

  const results = await Promise.all(
    orders.map(async (order) => {
      const payment = await Payment.findOne({ order: order._id });
      if (!payment) return null;
      return formatOrderResponse(order, payment);
    })
  );

  return {
    items: results.filter(Boolean),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function listAccountWishlist(userId: string) {
  const items = await Wishlist.find({ user: userId }).sort({ createdAt: -1 });

  return items
    .map((item) => {
      const productId = item.catalogueProductId;
      if (!productId) return null;
      const name = getCatalogueName(productId);
      const price = catalogueProductPrices[productId];
      if (!name) return null;
      return {
        id: item._id.toString(),
        productId,
        name,
        price: price ?? 0,
        slug: productId,
        addedAt: item.createdAt,
      };
    })
    .filter(Boolean);
}

export async function addWishlistItem(userId: string, catalogueProductId: string) {
  if (!catalogueProductNames[catalogueProductId]) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  const existing = await Wishlist.findOne({ user: userId, catalogueProductId });
  if (existing) return { id: existing._id.toString(), productId: catalogueProductId };

  const item = await Wishlist.create({
    user: userId,
    catalogueProductId,
  });

  return { id: item._id.toString(), productId: catalogueProductId };
}

export async function removeWishlistItem(userId: string, catalogueProductId: string) {
  await Wishlist.findOneAndDelete({ user: userId, catalogueProductId });
}

export async function syncWishlist(userId: string, productIds: string[]) {
  const validIds = productIds.filter((id) => catalogueProductNames[id]);
  await Promise.all(validIds.map((id) => addWishlistItem(userId, id)));
  return listAccountWishlist(userId);
}

export async function listAccountReviews(userId: string) {
  const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });

  return reviews.map((review) => ({
    id: review._id.toString(),
    productId: review.catalogueProductId,
    productName: review.catalogueProductId
      ? getCatalogueName(review.catalogueProductId)
      : 'Product',
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    isApproved: review.isApproved,
    createdAt: review.createdAt,
  }));
}

export async function createAccountReview(
  userId: string,
  input: { catalogueProductId: string; rating: number; title?: string; comment?: string }
) {
  if (!catalogueProductNames[input.catalogueProductId]) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  const existing = await Review.findOne({
    user: userId,
    catalogueProductId: input.catalogueProductId,
  });
  if (existing) {
    throw new AppError('You have already reviewed this product', httpStatus.CONFLICT, errorCodes.CONFLICT);
  }

  const review = await Review.create({
    user: userId,
    catalogueProductId: input.catalogueProductId,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
    isApproved: true,
  });

  return {
    id: review._id.toString(),
    productId: review.catalogueProductId,
    productName: getCatalogueName(input.catalogueProductId),
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    isApproved: review.isApproved,
    createdAt: review.createdAt,
  };
}

export async function deleteAccountReview(userId: string, reviewId: string) {
  const result = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!result) {
    throw new AppError('Review not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }
}

export function listAvailableCoupons() {
  return storeCoupons.map((c) => ({
    code: c.code,
    type: c.type,
    value: c.value,
    minOrderAmount: c.minOrderAmount,
    maxDiscount: c.maxDiscount,
    description:
      c.type === 'PERCENTAGE'
        ? `${c.value}% off on orders above ₹${c.minOrderAmount}`
        : `₹${c.value} off on orders above ₹${c.minOrderAmount}`,
  }));
}

export async function listAccountNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    items: items.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      isRead: n.isRead,
      createdAt: n.createdAt,
    })),
    unreadCount,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) {
    throw new AppError('Notification not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }
  return { id: notification._id.toString(), isRead: true };
}

export async function markAllNotificationsRead(userId: string) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
}

export async function getAccountStats(userId: string) {
  const [orderCount, wishlistCount, reviewCount, unreadNotifications] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Wishlist.countDocuments({ user: userId }),
    Review.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return { orderCount, wishlistCount, reviewCount, unreadNotifications };
}

// Re-export address helpers for account routes
export {
  listUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from '@/services/address.service.js';
