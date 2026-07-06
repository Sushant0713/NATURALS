export interface AddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  label?: 'HOME' | 'WORK' | 'OTHER';
}

export interface SavedAddress extends AddressSnapshot {
  id: string;
  isDefault: boolean;
  formattedAddress?: string;
}

export interface CheckoutOrderItem {
  productId: string;
  quantity: number;
  imageUrl?: string;
}

export interface CreateCheckoutPayload {
  items: CheckoutOrderItem[];
  shippingAddress: AddressSnapshot;
  billingAddress?: AddressSnapshot;
  couponCode?: string;
  shippingMethod: 'standard' | 'express';
  notes?: string;
  saveAddress?: boolean;
}

export interface CreateCheckoutResponse {
  orderId: string;
  orderNumber: string;
  paymentSessionId: string;
  cashfreeMode: 'sandbox' | 'production';
  mock: boolean;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
}

export interface OrderItem {
  productId?: string;
  productName: string;
  variantLabel: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: AddressSnapshot;
  billingAddress?: AddressSnapshot;
  notes?: string;
  createdAt: string;
  payment: {
    status: string;
    method?: string;
    paidAt?: string;
    amount: number;
  };
}

export interface PaymentConfig {
  provider: string;
  mode: 'sandbox' | 'production';
}
