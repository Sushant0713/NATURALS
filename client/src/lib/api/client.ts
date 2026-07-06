import type { ApiResponse } from '@/types/api';

import { apiRequest } from '@/lib/api/axios-client';

const ACCESS_TOKEN_KEY = 'raanjaai-access-token';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

interface FetchOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
  /** Pass `null` to skip auth token (login/register). Pass `undefined` for default. */
  token?: string | null;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers, body, method = 'GET', ...rest } = options;

  const skipAuth = token === null;

  return apiRequest<T>({
    url: path,
    method,
    data: body ? JSON.parse(body) : undefined,
    headers,
    skipAuth,
    ...rest,
  });
}
