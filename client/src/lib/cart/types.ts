export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface CartLineItem extends CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  lineTotal: number;
}
