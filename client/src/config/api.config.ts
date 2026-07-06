export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  timeout: 30_000,
  version: 'v1',
} as const;

export const apiEndpoints = {
  health: '/health',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  checkout: {
    paymentConfig: '/checkout/payment-config',
    orders: '/checkout/orders',
    order: (orderNumber: string) => `/checkout/orders/${orderNumber}`,
    verify: (orderNumber: string) => `/checkout/orders/${orderNumber}/verify`,
    addresses: '/checkout/addresses',
  },
} as const;
