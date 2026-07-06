import { OAuth2Client } from 'google-auth-library';

import { env } from '@/config/env.js';
import { authProviders, PASSWORD_RESET_EXPIRY_MS } from '@/constants/auth.js';
import { errorCodes } from '@/constants/error-codes.js';
import { userRoles } from '@/constants/enums.js';
import { httpStatus } from '@/constants/http-status.js';
import { User } from '@/models/user.model.js';
import { sendPasswordResetEmail } from '@/services/email.service.js';
import {
  createRefreshToken,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  rotateRefreshToken,
} from '@/services/token.service.js';
import type { AuthSessionResult } from '@/types/auth.js';
import type { IUser } from '@/types/models/user.types.js';
import { AppError } from '@/utils/app-error.js';
import { generateSecureToken, hashSha256 } from '@/utils/crypto.js';
import { signAccessToken } from '@/utils/jwt.js';
import { comparePassword, hashPassword } from '@/utils/password.js';
import { toSafeUser } from '@/utils/user-mapper.js';

function getGoogleClient(): OAuth2Client {
  if (!env.isGoogleOAuthEnabled) {
    throw new AppError('Google OAuth is not configured', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  return new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_CALLBACK_URL);
}

async function buildAuthResponse(
  user: IUser,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = await createRefreshToken(user._id.toString(), meta);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    accessToken,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    user: toSafeUser(user),
    refreshToken,
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<AuthSessionResult> {
  const existingEmail = await User.findOne({ email: input.email.toLowerCase() });
  if (existingEmail) {
    throw new AppError('Email already registered', httpStatus.CONFLICT, errorCodes.CONFLICT);
  }

  const existingPhone = await User.findOne({ phone: input.phone });
  if (existingPhone) {
    throw new AppError('Phone number already registered', httpStatus.CONFLICT, errorCodes.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash,
    authProvider: authProviders.LOCAL,
    isVerified: true,
    role: userRoles.CUSTOMER,
  });

  return buildAuthResponse(user);
}

export async function loginUser(
  input: { email: string; password: string },
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }

  return buildAuthResponse(user, meta);
}

export async function adminLogin(
  input: { email: string; password: string },
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const result = await loginUser(input, meta);
  const user = await User.findById(result.user.id);

  if (!user || (user.role !== userRoles.ADMIN && user.role !== userRoles.SUPER_ADMIN)) {
    await revokeAllUserRefreshTokens(result.user.id);
    throw new AppError('Admin access required', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  }

  return result;
}

export async function logoutUser(refreshToken?: string): Promise<void> {
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
}

export async function refreshAccessToken(
  refreshToken: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const rotation = await rotateRefreshToken(refreshToken, meta);

  if (!rotation) {
    throw new AppError('Invalid or expired refresh token', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }

  const user = await User.findById(rotation.userId);

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    user: toSafeUser(user),
    refreshToken: rotation.newToken,
  };
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.passwordHash) {
    return;
  }

  const resetToken = generateSecureToken(32);
  const hashedToken = hashSha256(resetToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);
  await user.save();

  const resetUrl = `${env.APP_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user.email!, resetUrl);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const hashedToken = hashSha256(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires +passwordHash');

  if (!user) {
    throw new AppError('Invalid or expired reset token', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await revokeAllUserRefreshTokens(user._id.toString());
}

export function getGoogleAuthUrl(): string {
  const client = getGoogleClient();

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile', 'openid'],
    prompt: 'consent',
    include_granted_scopes: true,
  });
}

export async function handleGoogleCallback(
  code: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const client = getGoogleClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) {
    throw new AppError('Failed to obtain Google ID token', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  return verifyGoogleIdToken(tokens.id_token, meta);
}

export async function verifyGoogleIdToken(
  idToken: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionResult> {
  const client = getGoogleClient();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email) {
    throw new AppError('Invalid Google token payload', httpStatus.BAD_REQUEST, errorCodes.BAD_REQUEST);
  }

  let user = await User.findOne({ googleId: payload.sub });

  if (!user) {
    user = await User.findOne({ email: payload.email.toLowerCase() });

    if (user) {
      user.googleId = payload.sub;
      user.authProvider = authProviders.GOOGLE;
      user.isVerified = true;
      if (payload.picture) user.avatarUrl = payload.picture;
      await user.save();
    } else {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name ?? payload.email.split('@')[0],
        avatarUrl: payload.picture,
        authProvider: authProviders.GOOGLE,
        isVerified: true,
        role: userRoles.CUSTOMER,
      });
    }
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  }

  return buildAuthResponse(user, meta);
}

export async function getUserById(userId: string): Promise<IUser> {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new AppError('User not found', httpStatus.NOT_FOUND, errorCodes.NOT_FOUND);
  }

  return user;
}
