import { GST_RATE, shippingOptions, type ShippingMethodId } from '@/constants/cart';
import type { StoreCoupon } from '@/constants/cart';
import type { AppliedCoupon, CartItem, CartLineItem, CartTotals } from '@/lib/cart/types';
import { getProductPrice } from '@/constants/pricing';
import { getProductBySlug, catalogueProducts } from '@/constants/products';

export function validateCoupon(code: string, subtotal: number, coupons: StoreCoupon[]): {
  valid: boolean;
  coupon?: AppliedCoupon;
  error?: string;
} {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, error: 'Please enter a coupon code' };
  }

  const coupon = coupons.find((c) => c.code === normalized);
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon`,
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
    },
  };
}

export function calculateShipping(
  subtotalAfterDiscount: number,
  methodId: ShippingMethodId
): number {
  const option = shippingOptions.find((o) => o.id === methodId) ?? shippingOptions[0];

  if (option.freeAbove !== null && subtotalAfterDiscount >= option.freeAbove) {
    return 0;
  }

  return option.price;
}

export function resolveCartLineItems(items: CartItem[]): CartLineItem[] {
  return items
    .map((item) => {
      const product = catalogueProducts.find((p) => p.id === item.productId);
      if (!product) return null;

      const price = getProductPrice(product.id);
      return {
        ...item,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        lineTotal: price * item.quantity,
      };
    })
    .filter((item): item is CartLineItem => item !== null);
}

export function calculateCartTotals(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingMethod: ShippingMethodId
): CartTotals & { lineItems: CartLineItem[] } {
  const lineItems = resolveCartLineItems(items);
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = coupon?.discountAmount ?? 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(subtotalAfterDiscount, shippingMethod);
  const taxableAmount = subtotalAfterDiscount + shipping;
  const tax = Math.round(taxableAmount * GST_RATE);
  const total = taxableAmount + tax;
  const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, discount, shipping, tax, total, itemCount, lineItems };
}

export function getProductByIdForCart(productId: string) {
  return catalogueProducts.find((p) => p.id === productId);
}

export function getProductBySlugForCart(slug: string) {
  return getProductBySlug(slug);
}
