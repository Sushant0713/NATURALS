export type CouponType = 'percentage' | 'fixed';

export interface StoreCoupon {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  description: string;
}

export const storeCoupons: StoreCoupon[] = [
  {
    code: 'NATURE10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 500,
    description: '10% off on orders above ₹500',
  },
  {
    code: 'WELCOME50',
    type: 'fixed',
    value: 50,
    minOrderAmount: 300,
    description: '₹50 off on orders above ₹300',
  },
  {
    code: 'ORGANIC15',
    type: 'percentage',
    value: 15,
    minOrderAmount: 800,
    maxDiscount: 200,
    description: '15% off (max ₹200) on orders above ₹800',
  },
];

export const FREE_SHIPPING_THRESHOLD = 999;

export const shippingOptions = [
  {
    id: 'standard' as const,
    label: 'Standard Delivery',
    description: '5–7 business days',
    price: 60,
    freeAbove: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: 'express' as const,
    label: 'Express Delivery',
    description: '2–3 business days',
    price: 120,
    freeAbove: null,
  },
];

/** Combined GST rate for food products (5%) */
export const GST_RATE = 0.05;

export type ShippingMethodId = (typeof shippingOptions)[number]['id'];
