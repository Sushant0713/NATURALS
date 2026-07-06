import type { OrderDetails } from '@/types/checkout';

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  revenue30d: number;
  recentOrders: OrderDetails[];
  lowStockAlerts: { id: string; name: string; slug: string; stock: number }[];
}

export interface AnalyticsData {
  rangeDays: number;
  totalRevenue: number;
  totalOrders: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}

export interface AdminOrder extends OrderDetails {
  customerName?: string;
  customerEmail?: string;
  trackingNumber?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: unknown;
  isActive: boolean;
  isBestseller: boolean;
  isOrganic: boolean;
  startingPrice?: number;
  primaryImage?: string;
  stock: number;
  reviewCount: number;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  sku: string;
  label: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  price: number;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  isValid?: boolean;
}

export interface AdminReview {
  id: string;
  userName: string;
  productId?: string;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AdminBlog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  authorName: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  linkLabel?: string;
  placement: string;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
}

export interface ReportsSummary {
  generatedAt: string;
  orders: { total: number };
  revenue: { total: number; transactions: number };
  users: { total: number };
  products: { total: number };
  reviews: { total: number };
  activeCoupons: number;
}
