import type { Response } from 'express';

import { env } from '@/config/env.js';
import { REFRESH_TOKEN_COOKIE } from '@/constants/auth.js';
import { parseExpiresInToMs } from '@/utils/jwt.js';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    domain: env.COOKIE_DOMAIN,
    path: '/api/v1/auth',
    maxAge: parseExpiresInToMs(env.JWT_REFRESH_EXPIRES_IN),
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    domain: env.COOKIE_DOMAIN,
    path: '/api/v1/auth',
  });
}

export function getRefreshTokenFromCookie(cookies: Record<string, string | undefined>): string | undefined {
  return cookies[REFRESH_TOKEN_COOKIE];
}
