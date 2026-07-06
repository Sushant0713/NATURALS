export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  account: {
    all: ['account'] as const,
    profile: () => [...queryKeys.account.all, 'profile'] as const,
    stats: () => [...queryKeys.account.all, 'stats'] as const,
    orders: (page = 1) => [...queryKeys.account.all, 'orders', page] as const,
    wishlist: () => [...queryKeys.account.all, 'wishlist'] as const,
    addresses: () => [...queryKeys.account.all, 'addresses'] as const,
    reviews: () => [...queryKeys.account.all, 'reviews'] as const,
    coupons: () => [...queryKeys.account.all, 'coupons'] as const,
    notifications: (page = 1) => [...queryKeys.account.all, 'notifications', page] as const,
  },
  checkout: {
    all: ['checkout'] as const,
    paymentConfig: () => [...queryKeys.checkout.all, 'payment-config'] as const,
    addresses: () => [...queryKeys.checkout.all, 'addresses'] as const,
    order: (orderNumber: string) => [...queryKeys.checkout.all, 'order', orderNumber] as const,
    verify: (orderNumber: string) => [...queryKeys.checkout.all, 'verify', orderNumber] as const,
  },
  admin: {
    all: ['admin'] as const,
    dashboard: () => [...queryKeys.admin.all, 'dashboard'] as const,
    analytics: (days: number) => [...queryKeys.admin.all, 'analytics', days] as const,
    reports: () => [...queryKeys.admin.all, 'reports'] as const,
    orders: (page: number, status?: string) =>
      [...queryKeys.admin.all, 'orders', page, status ?? 'all'] as const,
    products: (page: number, search?: string) =>
      [...queryKeys.admin.all, 'products', page, search ?? ''] as const,
    categories: () => [...queryKeys.admin.all, 'categories'] as const,
    users: (page: number, search?: string) =>
      [...queryKeys.admin.all, 'users', page, search ?? ''] as const,
    inventory: (page: number) => [...queryKeys.admin.all, 'inventory', page] as const,
    coupons: () => [...queryKeys.admin.all, 'coupons'] as const,
    reviews: (page: number, approved?: string) =>
      [...queryKeys.admin.all, 'reviews', page, approved ?? 'all'] as const,
    blogs: (page: number) => [...queryKeys.admin.all, 'blogs', page] as const,
    banners: () => [...queryKeys.admin.all, 'banners'] as const,
  },
} as const;
