import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '@/config/env.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import type { AccessTokenPayload } from '@/types/auth.js';
import { AppError } from '@/utils/app-error.js';

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

    if (!decoded.sub || !decoded.role) {
      throw new AppError('Invalid access token', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Access token expired', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
    }

    throw new AppError('Invalid access token', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }
}

export function parseExpiresInToMs(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] ?? multipliers.d);
}
