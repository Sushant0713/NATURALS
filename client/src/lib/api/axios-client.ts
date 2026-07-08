import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';

import { apiConfig } from '@/config/api.config';
import type { ApiResponse } from '@/types/api';

import { ApiError } from '@/lib/api/api-error';
import { getStoredAccessToken } from '@/lib/api/client';

export interface ApiRequestConfig extends AxiosRequestConfig {
  /** Skip attaching the Bearer token (login, register, refresh). */
  skipAuth?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const custom = config as ApiRequestConfig;
  if (!custom.skipAuth) {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse;

    if (body && body.success === false) {
      throw ApiError.fromResponse(body, response.status);
    }

    if (body?.error) {
      throw ApiError.fromResponse(body, response.status);
    }

    return response;
  },
  (error) => {
    if (isAxiosError(error)) {
      const body = error.response?.data as ApiResponse | undefined;
      if (body) {
        throw ApiError.fromResponse(body, error.response?.status ?? 500);
      }
      if (error.code === 'ECONNABORTED') {
        throw new ApiError('Request timed out. Please try again.', 'TIMEOUT', 408);
      }
      throw ApiError.network(error.message);
    }
    throw ApiError.network();
  }
);

export async function apiRequest<T>(
  config: ApiRequestConfig
): Promise<ApiResponse<T>> {
  // Disconnect backend by returning mock responses for all requests
  const url = config.url || '';
  console.log(`[Mock API Client] Intercepting request: ${config.method} ${url}`, config.data);

  let mockData: unknown = null;

  if (url.includes('/auth/me')) {
    mockData = {
      id: 'mock-user-123',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'user',
    };
  } else if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
    mockData = {
      accessToken: 'mock-access-token-xyz',
      user: {
        id: 'mock-user-123',
        name: 'Guest User',
        email: 'guest@example.com',
        role: 'user',
      }
    };
  } else if (url.includes('/account/profile')) {
    mockData = {
      id: 'mock-user-123',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'user',
    };
  } else if (url.includes('/account/wishlist')) {
    mockData = [];
  } else if (url.includes('/account/addresses') || url.includes('/checkout/addresses')) {
    mockData = [];
  } else if (url.includes('/account/reviews')) {
    mockData = [];
  } else if (url.includes('/account/coupons')) {
    mockData = [];
  } else if (url.includes('/account/notifications')) {
    mockData = {
      notifications: [],
      pagination: { total: 0, pages: 0, page: 1, limit: 10 }
    };
  } else if (url.includes('/checkout/payment-config')) {
    mockData = {
      key: 'mock_razorpay_key',
    };
  } else if (url.includes('/checkout/orders')) {
    mockData = {
      id: 'order_mock123',
      orderNumber: 'RN-' + Math.floor(Math.random() * 1000000),
      amount: 1500,
      currency: 'INR',
      status: 'pending',
    };
  } else if (url.includes('/verify')) {
    mockData = {
      id: 'order_mock123',
      orderNumber: 'RN-123456',
      status: 'success',
      paymentStatus: 'paid',
    };
  }

  return {
    success: true,
    data: mockData as T,
  };
}
