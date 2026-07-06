export const userRoles = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof userRoles)[keyof typeof userRoles];

export const orderStatuses = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof orderStatuses)[keyof typeof orderStatuses];

export const paymentStatuses = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof paymentStatuses)[keyof typeof paymentStatuses];

export const paymentMethods = {
  UPI: 'UPI',
  CARD: 'CARD',
  NETBANKING: 'NETBANKING',
  WALLET: 'WALLET',
  COD: 'COD',
} as const;

export type PaymentMethod = (typeof paymentMethods)[keyof typeof paymentMethods];

export const couponTypes = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
} as const;

export type CouponType = (typeof couponTypes)[keyof typeof couponTypes];

export const addressLabels = {
  HOME: 'HOME',
  WORK: 'WORK',
  OTHER: 'OTHER',
} as const;

export type AddressLabel = (typeof addressLabels)[keyof typeof addressLabels];

export const notificationTypes = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
  PRODUCT: 'PRODUCT',
  ACCOUNT: 'ACCOUNT',
} as const;

export type NotificationType = (typeof notificationTypes)[keyof typeof notificationTypes];
