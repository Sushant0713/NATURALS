import type { OrderDetails } from '@/types/checkout';

export interface UserPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  smsNotifications: boolean;
}

export interface AccountProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  avatarUrl?: string;
  authProvider: string;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface AccountStats {
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
  unreadNotifications: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  slug: string;
  addedAt: string;
}

export interface UserReview {
  id: string;
  productId?: string;
  productName?: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface StoreCoupon {
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  description: string;
}

export interface UserNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedOrders {
  items: OrderDetails[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface PaginatedNotifications {
  items: UserNotification[];
  unreadCount: number;
  meta: { total: number; page: number; limit: number; totalPages: number };
}
