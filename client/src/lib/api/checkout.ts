import { apiFetch } from '@/lib/api/client';
import type {
  CreateCheckoutPayload,
  CreateCheckoutResponse,
  OrderDetails,
  PaymentConfig,
  SavedAddress,
  AddressSnapshot,
} from '@/types/checkout';

export async function getPaymentConfig(): Promise<PaymentConfig> {
  const res = await apiFetch<PaymentConfig>('/checkout/payment-config');
  return res.data!;
}

export async function createCheckoutOrder(
  payload: CreateCheckoutPayload
): Promise<CreateCheckoutResponse> {
  const res = await apiFetch<CreateCheckoutResponse>('/checkout/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function verifyOrder(orderNumber: string): Promise<OrderDetails> {
  const res = await apiFetch<OrderDetails>(`/checkout/orders/${orderNumber}/verify`);
  return res.data!;
}

export async function getOrder(orderNumber: string): Promise<OrderDetails> {
  const res = await apiFetch<OrderDetails>(`/checkout/orders/${orderNumber}`);
  return res.data!;
}

export async function listAddresses(): Promise<SavedAddress[]> {
  const res = await apiFetch<SavedAddress[]>('/checkout/addresses');
  return res.data ?? [];
}

export async function createAddress(address: AddressSnapshot & { isDefault?: boolean }) {
  const res = await apiFetch<SavedAddress>('/checkout/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  });
  return res.data!;
}
