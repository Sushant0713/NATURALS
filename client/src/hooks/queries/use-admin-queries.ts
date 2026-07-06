'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi } from '@/lib/api/admin';
import { queryKeys } from '@/lib/query/query-keys';
import type { AdminReview, PaginatedMeta } from '@/types/admin';

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminApi.dashboard(),
    staleTime: 30 * 1000,
  });
}

export function useAdminAnalyticsQuery(days = 30) {
  return useQuery({
    queryKey: queryKeys.admin.analytics(days),
    queryFn: () => adminApi.analytics(days),
  });
}

export function useAdminReportsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.reports(),
    queryFn: () => adminApi.reports(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminOrdersQuery(page = 1, status?: string) {
  return useQuery({
    queryKey: queryKeys.admin.orders(page, status),
    queryFn: () => adminApi.orders(page, status),
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      trackingNumber,
    }: {
      id: string;
      status: string;
      trackingNumber?: string;
    }) => adminApi.updateOrderStatus(id, status, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
    },
  });
}

export function useAdminProductsQuery(page = 1, search?: string) {
  return useQuery({
    queryKey: queryKeys.admin.products(page, search),
    queryFn: () => adminApi.products(page, search),
  });
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.categories(),
    queryFn: () => adminApi.categories(),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'products'] });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'products'] });
    },
  });
}

export function useSyncCatalogueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.syncCatalogue(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() });
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() }),
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() }),
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories() }),
  });
}

export function useAdminUsersQuery(page = 1, search?: string) {
  return useQuery({
    queryKey: queryKeys.admin.users(page, search),
    queryFn: () => adminApi.users(page, search),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'users'] }),
  });
}

export function useAdminInventoryQuery(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.inventory(page),
    queryFn: () => adminApi.inventory(page),
  });
}

export function useUpdateInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      data,
    }: {
      productId: string;
      variantId: string;
      data: Record<string, unknown>;
    }) => adminApi.updateInventory(productId, variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'inventory'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
    },
  });
}

export function useAdminCouponsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.coupons(),
    queryFn: () => adminApi.coupons(),
  });
}

export function useCreateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.createCoupon(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() }),
  });
}

export function useUpdateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateCoupon(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() }),
  });
}

export function useDeleteCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.coupons() }),
  });
}

export function useAdminReviewsQuery(page = 1, approved?: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.reviews(page, approved === undefined ? 'all' : String(approved)),
    queryFn: () => adminApi.reviews(page, approved),
  });
}

export function useUpdateAdminReviewMutation(page = 1, approved?: boolean) {
  const queryClient = useQueryClient();
  const listKey = queryKeys.admin.reviews(page, approved === undefined ? 'all' : String(approved));

  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      adminApi.updateReview(id, isApproved),
    onMutate: async ({ id, isApproved }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<{
        items: AdminReview[];
        meta: PaginatedMeta;
      }>(listKey);
      if (previous) {
        queryClient.setQueryData(listKey, {
          ...previous,
          items: previous.items.map((r) => (r.id === id ? { ...r, isApproved } : r)),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'reviews'] });
    },
  });
}

export function useDeleteAdminReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'reviews'] }),
  });
}

export function useAdminBlogsQuery(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.blogs(page),
    queryFn: () => adminApi.blogs(page),
  });
}

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.createBlog(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'blogs'] }),
  });
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateBlog(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'blogs'] }),
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBlog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'blogs'] }),
  });
}

export function useAdminBannersQuery() {
  return useQuery({
    queryKey: queryKeys.admin.banners(),
    queryFn: () => adminApi.banners(),
  });
}

export function useCreateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.createBanner(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.banners() }),
  });
}

export function useUpdateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      adminApi.updateBanner(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.banners() }),
  });
}

export function useDeleteBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.banners() }),
  });
}
