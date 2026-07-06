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
  const response = await axiosInstance.request<ApiResponse<T>>(config);
  return response.data;
}
