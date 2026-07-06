import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { AppError } from '@/utils/app-error.js';
import { httpStatus } from '@/constants/http-status.js';
import { errorCodes } from '@/constants/error-codes.js';

const CASHFREE_API_VERSION = '2023-08-01';

interface CashfreeCustomer {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface CreateCashfreeOrderInput {
  orderId: string;
  amount: number;
  customer: CashfreeCustomer;
  returnUrl: string;
  notifyUrl?: string;
}

export interface CashfreeOrderResponse {
  cfOrderId: string;
  orderId: string;
  paymentSessionId: string;
  orderStatus: string;
  mock?: boolean;
}

interface CashfreeFetchOrderResponse {
  order_status: string;
  payment_session_id?: string;
  order_amount: number;
  cf_order_id: string;
}

async function cashfreeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${env.cashfreeBaseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': CASHFREE_API_VERSION,
      'x-client-id': env.CASHFREE_APP_ID!,
      'x-client-secret': env.CASHFREE_SECRET_KEY!,
      ...options.headers,
    },
  });

  const body = (await res.json()) as T & { message?: string };

  if (!res.ok) {
    logger.error('Cashfree API error', { path, status: res.status, body });
    throw new AppError(
      (body as { message?: string }).message ?? 'Cashfree payment request failed',
      httpStatus.INTERNAL_SERVER_ERROR,
      errorCodes.BAD_REQUEST
    );
  }

  return body;
}

export async function createCashfreeOrder(
  input: CreateCashfreeOrderInput
): Promise<CashfreeOrderResponse> {
  if (!env.isCashfreeEnabled) {
    logger.warn('Cashfree not configured — using mock payment session');
    return {
      cfOrderId: `mock_cf_${input.orderId}`,
      orderId: input.orderId,
      paymentSessionId: `mock_session_${input.orderId}`,
      orderStatus: 'ACTIVE',
      mock: true,
    };
  }

  const body = {
    order_id: input.orderId,
    order_amount: input.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: input.customer.customerId,
      customer_name: input.customer.customerName,
      customer_email: input.customer.customerEmail,
      customer_phone: input.customer.customerPhone,
    },
    order_meta: {
      return_url: input.returnUrl,
      notify_url: input.notifyUrl,
    },
  };

  const data = await cashfreeFetch<{
    cf_order_id: string;
    order_id: string;
    payment_session_id: string;
    order_status: string;
  }>('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return {
    cfOrderId: data.cf_order_id,
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    orderStatus: data.order_status,
  };
}

export async function fetchCashfreeOrder(orderId: string): Promise<CashfreeFetchOrderResponse> {
  if (!env.isCashfreeEnabled) {
    return {
      order_status: 'PAID',
      cf_order_id: `mock_cf_${orderId}`,
      order_amount: 0,
    };
  }

  return cashfreeFetch<CashfreeFetchOrderResponse>(`/orders/${orderId}`);
}

export function mapCashfreeStatus(status: string): 'SUCCESS' | 'FAILED' | 'PENDING' {
  const normalized = status.toUpperCase();
  if (['PAID', 'SUCCESS'].includes(normalized)) return 'SUCCESS';
  if (['FAILED', 'CANCELLED', 'USER_DROPPED', 'VOID'].includes(normalized)) return 'FAILED';
  return 'PENDING';
}

export function getCashfreeMode(): 'sandbox' | 'production' {
  return env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
}
