import { apiFetch } from '@/lib/api/client';
import type {
  AdminBanner,
  AdminBlog,
  AdminCategory,
  AdminCoupon,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminUser,
  AnalyticsData,
  DashboardStats,
  InventoryItem,
  PaginatedMeta,
  ReportsSummary,
} from '@/types/admin';

async function get<T>(path: string): Promise<T> {
  const res = await apiFetch<T>(path);
  return res.data!;
}

async function mutate<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await apiFetch<T>(path, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return res.data!;
}

export const adminApi = {
  dashboard: () => get<DashboardStats>('/admin/dashboard'),
  analytics: (days = 30) => get<AnalyticsData>(`/admin/analytics?days=${days}`),
  reports: () => get<ReportsSummary>('/admin/reports'),

  orders: (page = 1, status?: string) =>
    get<{ items: AdminOrder[]; meta: PaginatedMeta }>(
      `/admin/orders?page=${page}${status ? `&status=${status}` : ''}`
    ),
  updateOrderStatus: (id: string, status: string, trackingNumber?: string) =>
    mutate<AdminOrder>(`/admin/orders/${id}/status`, 'PATCH', { status, trackingNumber }),

  products: (page = 1, search?: string) =>
    get<{ items: AdminProduct[]; meta: PaginatedMeta }>(
      `/admin/products?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    ),
  createProduct: (data: Record<string, unknown>) => mutate('/admin/products', 'POST', data),
  updateProduct: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/products/${id}`, 'PATCH', data),
  deleteProduct: (id: string) => mutate(`/admin/products/${id}`, 'DELETE'),
  syncCatalogue: () => mutate<{ synced: number; total: number }>('/admin/products/sync-catalogue', 'POST'),

  categories: () => get<AdminCategory[]>('/admin/categories'),
  createCategory: (data: Record<string, unknown>) => mutate('/admin/categories', 'POST', data),
  updateCategory: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/categories/${id}`, 'PATCH', data),
  deleteCategory: (id: string) => mutate(`/admin/categories/${id}`, 'DELETE'),

  users: (page = 1, search?: string) =>
    get<{ items: AdminUser[]; meta: PaginatedMeta }>(
      `/admin/users?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`
    ),
  updateUser: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/users/${id}`, 'PATCH', data),

  inventory: (page = 1) =>
    get<{ items: InventoryItem[]; meta: PaginatedMeta }>(`/admin/inventory?page=${page}`),
  updateInventory: (productId: string, variantId: string, data: Record<string, unknown>) =>
    mutate(`/admin/inventory/${productId}/${variantId}`, 'PATCH', data),

  coupons: () => get<AdminCoupon[]>('/admin/coupons'),
  createCoupon: (data: Record<string, unknown>) => mutate('/admin/coupons', 'POST', data),
  updateCoupon: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/coupons/${id}`, 'PATCH', data),
  deleteCoupon: (id: string) => mutate(`/admin/coupons/${id}`, 'DELETE'),

  reviews: (page = 1, approved?: boolean) =>
    get<{ items: AdminReview[]; meta: PaginatedMeta }>(
      `/admin/reviews?page=${page}${approved !== undefined ? `&approved=${approved}` : ''}`
    ),
  updateReview: (id: string, isApproved: boolean) =>
    mutate(`/admin/reviews/${id}`, 'PATCH', { isApproved }),
  deleteReview: (id: string) => mutate(`/admin/reviews/${id}`, 'DELETE'),

  blogs: (page = 1) =>
    get<{ items: AdminBlog[]; meta: PaginatedMeta }>(`/admin/blogs?page=${page}`),
  createBlog: (data: Record<string, unknown>) => mutate('/admin/blogs', 'POST', data),
  updateBlog: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/blogs/${id}`, 'PATCH', data),
  deleteBlog: (id: string) => mutate(`/admin/blogs/${id}`, 'DELETE'),

  banners: () => get<AdminBanner[]>('/admin/banners'),
  createBanner: (data: Record<string, unknown>) => mutate('/admin/banners', 'POST', data),
  updateBanner: (id: string, data: Record<string, unknown>) =>
    mutate(`/admin/banners/${id}`, 'PATCH', data),
  deleteBanner: (id: string) => mutate(`/admin/banners/${id}`, 'DELETE'),
};
