import type { Request, Response } from 'express';

import { env } from '@/config/env.js';
import {
  adminLogin,
  forgotPassword,
  getGoogleAuthUrl,
  getUserById,
  handleGoogleCallback,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  verifyGoogleIdToken,
} from '@/services/auth.service.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { sendSuccess } from '@/utils/api-response.js';
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from '@/utils/cookies.js';
import type { AuthSessionResult } from '@/types/auth.js';
import { AppError } from '@/utils/app-error.js';
import { toSafeUser } from '@/utils/user-mapper.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';

function getRequestMeta(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

function sendAuthResponse(res: Response, result: AuthSessionResult, statusCode = 200): Response {
  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess(
    res,
    {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user,
    },
    undefined,
    statusCode
  );
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  return sendAuthResponse(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body, getRequestMeta(req));
  return sendAuthResponse(res, result);
});

export const adminLoginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminLogin(req.body, getRequestMeta(req));
  return sendAuthResponse(res, result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req.cookies as Record<string, string | undefined>);
  await logoutUser(refreshToken);
  clearRefreshTokenCookie(res);
  return sendSuccess(res, null, 'Logged out successfully');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req.cookies as Record<string, string | undefined>);

  if (!refreshToken) {
    throw new AppError('Refresh token not found', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }

  const result = await refreshAccessToken(refreshToken, getRequestMeta(req));
  return sendAuthResponse(res, result);
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  await forgotPassword(req.body.email);
  return sendSuccess(
    res,
    null,
    'If an account exists with that email, a password reset link has been sent'
  );
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.token, req.body.password);
  return sendSuccess(res, null, 'Password reset successfully');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);
  return sendSuccess(res, toSafeUser(user));
});

export const googleAuth = asyncHandler(async (_req: Request, res: Response) => {
  if (!env.isGoogleOAuthEnabled) {
    throw new AppError('Google OAuth is not configured', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  const url = getGoogleAuthUrl();
  res.redirect(url);
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    throw new AppError('Authorization code missing', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  const result = await handleGoogleCallback(code, getRequestMeta(req));
  setRefreshTokenCookie(res, result.refreshToken);

  res.redirect(`${env.APP_URL}/auth/google/success`);
});

export const googleTokenLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await verifyGoogleIdToken(req.body.idToken, getRequestMeta(req));
  return sendAuthResponse(res, result);
});
