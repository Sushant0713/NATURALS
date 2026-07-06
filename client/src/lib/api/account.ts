import { apiFetch } from '@/lib/api/client';
import type { SavedAddress, AddressSnapshot } from '@/types/checkout';
import type {
  AccountProfile,
  AccountStats,
  PaginatedNotifications,
  PaginatedOrders,
  StoreCoupon,
  UserPreferences,
  UserReview,
  WishlistItem,
} from '@/types/account';

export async function fetchProfile(): Promise<AccountProfile> {
  const res = await apiFetch<AccountProfile>('/account/profile');
  return res.data!;
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<AccountProfile> {
  const res = await apiFetch<AccountProfile>('/account/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateSettings(data: {
  preferences?: Partial<UserPreferences>;
  currentPassword?: string;
  newPassword?: string;
}): Promise<AccountProfile> {
  const res = await apiFetch<AccountProfile>('/account/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function fetchAccountStats(): Promise<AccountStats> {
  const res = await apiFetch<AccountStats>('/account/stats');
  return res.data!;
}

export async function fetchOrders(page = 1): Promise<PaginatedOrders> {
  const res = await apiFetch<PaginatedOrders>(`/account/orders?page=${page}`);
  return res.data!;
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const res = await apiFetch<WishlistItem[]>('/account/wishlist');
  return res.data ?? [];
}

export async function syncWishlist(productIds: string[]): Promise<WishlistItem[]> {
  const res = await apiFetch<WishlistItem[]>('/account/wishlist/sync', {
    method: 'POST',
    body: JSON.stringify({ productIds }),
  });
  return res.data ?? [];
}

export async function removeWishlistItem(productId: string): Promise<void> {
  await apiFetch(`/account/wishlist/${productId}`, { method: 'DELETE' });
}

export async function fetchAddresses(): Promise<SavedAddress[]> {
  const res = await apiFetch<SavedAddress[]>('/account/addresses');
  return res.data ?? [];
}

export async function createAddress(data: AddressSnapshot & { isDefault?: boolean }) {
  const res = await apiFetch<SavedAddress>('/account/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiFetch(`/account/addresses/${id}`, { method: 'DELETE' });
}

export async function fetchReviews(): Promise<UserReview[]> {
  const res = await apiFetch<UserReview[]>('/account/reviews');
  return res.data ?? [];
}

export async function createReview(data: {
  catalogueProductId: string;
  rating: number;
  title?: string;
  comment?: string;
}): Promise<UserReview> {
  const res = await apiFetch<UserReview>('/account/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function deleteReview(id: string): Promise<void> {
  await apiFetch(`/account/reviews/${id}`, { method: 'DELETE' });
}

export async function fetchCoupons(): Promise<StoreCoupon[]> {
  const res = await apiFetch<StoreCoupon[]>('/account/coupons');
  return res.data ?? [];
}

export async function fetchNotifications(page = 1): Promise<PaginatedNotifications> {
  const res = await apiFetch<PaginatedNotifications>(`/account/notifications?page=${page}`);
  return res.data!;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/account/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/account/notifications/read-all', { method: 'PATCH' });
}
