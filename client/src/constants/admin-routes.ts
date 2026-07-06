export const adminRoutes = {
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  analytics: '/admin/analytics',
  orders: '/admin/orders',
  products: '/admin/products',
  categories: '/admin/categories',
  users: '/admin/users',
  inventory: '/admin/inventory',
  coupons: '/admin/coupons',
  reviews: '/admin/reviews',
  blogs: '/admin/blogs',
  reports: '/admin/reports',
  banners: '/admin/banners',
} as const;

export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;
