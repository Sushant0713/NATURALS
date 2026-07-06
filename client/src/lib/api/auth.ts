import { apiFetch, setStoredAccessToken } from '@/lib/api/client';
import type { AuthTokens, LoginCredentials, RegisterCredentials, SafeUser } from '@/types/auth';

export async function loginUser(credentials: LoginCredentials): Promise<AuthTokens> {
  const res = await apiFetch<AuthTokens>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    token: null,
  });

  if (!res.data) throw new Error('Login failed');
  setStoredAccessToken(res.data.accessToken);
  return res.data;
}

export async function adminLogin(credentials: LoginCredentials): Promise<AuthTokens> {
  const res = await apiFetch<AuthTokens>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    token: null,
  });

  if (!res.data) throw new Error('Admin login failed');
  setStoredAccessToken(res.data.accessToken);
  return res.data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthTokens> {
  const res = await apiFetch<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
    token: null,
  });

  if (!res.data) throw new Error('Registration failed');
  setStoredAccessToken(res.data.accessToken);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch<null>('/auth/logout', { method: 'POST' });
  } finally {
    setStoredAccessToken(null);
  }
}

export async function refreshSession(): Promise<AuthTokens | null> {
  try {
    const res = await apiFetch<AuthTokens>('/auth/refresh', { method: 'POST', token: null });
    if (!res.data) return null;
    setStoredAccessToken(res.data.accessToken);
    return res.data;
  } catch {
    setStoredAccessToken(null);
    return null;
  }
}

export async function fetchCurrentUser(): Promise<SafeUser | null> {
  try {
    const res = await apiFetch<SafeUser>('/auth/me');
    return res.data ?? null;
  } catch {
    return null;
  }
}
