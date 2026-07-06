'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAddress,
  createReview,
  deleteAddress,
  deleteReview,
  fetchAccountStats,
  fetchAddresses,
  fetchCoupons,
  fetchNotifications,
  fetchOrders,
  fetchProfile,
  fetchReviews,
  fetchWishlist,
  markAllNotificationsRead,
  markNotificationRead,
  removeWishlistItem,
  syncWishlist,
  updateProfile,
  updateSettings,
} from '@/lib/api/account';
import { queryKeys } from '@/lib/query/query-keys';
import type { PaginatedNotifications, WishlistItem } from '@/types/account';

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.account.profile(),
    queryFn: fetchProfile,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.account.profile(), data);
    },
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.account.profile(), data);
    },
  });
}

export function useAccountStatsQuery() {
  return useQuery({
    queryKey: queryKeys.account.stats(),
    queryFn: fetchAccountStats,
  });
}

export function useOrdersQuery(page = 1) {
  return useQuery({
    queryKey: queryKeys.account.orders(page),
    queryFn: () => fetchOrders(page),
  });
}

export function useWishlistQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.account.wishlist(),
    queryFn: fetchWishlist,
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useSyncWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productIds: string[]) => syncWishlist(productIds),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.account.wishlist(), data);
    },
  });
}

export function useToggleWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const current = queryClient.getQueryData<WishlistItem[]>(queryKeys.account.wishlist()) ?? [];
      const exists = current.some((w) => w.productId === productId);
      if (exists) {
        await removeWishlistItem(productId);
        return;
      }
      await syncWishlist([...current.map((w) => w.productId), productId]);
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.account.wishlist() });
      const previous = queryClient.getQueryData<WishlistItem[]>(queryKeys.account.wishlist()) ?? [];
      const exists = previous.some((w) => w.productId === productId);
      const optimistic: WishlistItem[] = exists
        ? previous.filter((w) => w.productId !== productId)
        : [
            ...previous,
            {
              id: `optimistic-${productId}`,
              productId,
              name: '',
              price: 0,
              slug: productId,
              addedAt: new Date().toISOString(),
            },
          ];
      queryClient.setQueryData(queryKeys.account.wishlist(), optimistic);
      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.account.wishlist(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.wishlist() });
    },
  });
}

export function useRemoveWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWishlistItem,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.account.wishlist() });
      const previous = queryClient.getQueryData<WishlistItem[]>(queryKeys.account.wishlist());
      if (previous) {
        queryClient.setQueryData(
          queryKeys.account.wishlist(),
          previous.filter((item) => item.productId !== productId)
        );
      }
      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.account.wishlist(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.wishlist() });
    },
  });
}

export function useAddressesQuery() {
  return useQuery({
    queryKey: queryKeys.account.addresses(),
    queryFn: fetchAddresses,
  });
}

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkout.addresses() });
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.addresses() });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkout.addresses() });
    },
  });
}

export function useReviewsQuery() {
  return useQuery({
    queryKey: queryKeys.account.reviews(),
    queryFn: fetchReviews,
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.reviews() });
    },
  });
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.account.reviews() });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof fetchReviews>>>(
        queryKeys.account.reviews()
      );
      if (previous) {
        queryClient.setQueryData(
          queryKeys.account.reviews(),
          previous.filter((r) => r.id !== id)
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.account.reviews(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.reviews() });
    },
  });
}

export function useCouponsQuery() {
  return useQuery({
    queryKey: queryKeys.account.coupons(),
    queryFn: fetchCoupons,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotificationsQuery(page = 1) {
  return useQuery({
    queryKey: queryKeys.account.notifications(page),
    queryFn: () => fetchNotifications(page),
  });
}

export function useMarkNotificationReadMutation(page = 1) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.account.notifications(page) });
      const previous = queryClient.getQueryData<PaginatedNotifications>(
        queryKeys.account.notifications(page)
      );
      if (previous) {
        queryClient.setQueryData(queryKeys.account.notifications(page), {
          ...previous,
          unreadCount: Math.max(0, previous.unreadCount - (previous.items.find((n) => n.id === id && !n.isRead) ? 1 : 0)),
          items: previous.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        });
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.account.notifications(page), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.notifications() });
    },
  });
}

export function useMarkAllNotificationsReadMutation(page = 1) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.account.notifications(page) });
      const previous = queryClient.getQueryData<PaginatedNotifications>(
        queryKeys.account.notifications(page)
      );
      if (previous) {
        queryClient.setQueryData(queryKeys.account.notifications(page), {
          ...previous,
          unreadCount: 0,
          items: previous.items.map((n) => ({ ...n, isRead: true })),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.account.notifications(page), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.notifications() });
    },
  });
}
