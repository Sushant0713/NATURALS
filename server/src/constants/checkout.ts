export const FREE_SHIPPING_THRESHOLD = 999;
export const GST_RATE = 0.05;

export const shippingOptions = {
  standard: { price: 60, freeAbove: FREE_SHIPPING_THRESHOLD },
  express: { price: 120, freeAbove: null as number | null },
} as const;

export type ShippingMethodId = keyof typeof shippingOptions;

export const storeCoupons = [
  { code: 'NATURE10', type: 'PERCENTAGE' as const, value: 10, minOrderAmount: 500, maxDiscount: undefined },
  { code: 'WELCOME50', type: 'FIXED' as const, value: 50, minOrderAmount: 300, maxDiscount: undefined },
  {
    code: 'ORGANIC15',
    type: 'PERCENTAGE' as const,
    value: 15,
    minOrderAmount: 800,
    maxDiscount: 200,
  },
];
