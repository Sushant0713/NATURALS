import { env } from '@/config/env.js';
import { RefreshToken } from '@/models/refresh-token.model.js';
import { generateSecureToken, hashSha256 } from '@/utils/crypto.js';
import { parseExpiresInToMs } from '@/utils/jwt.js';
import { hashToken, compareToken } from '@/utils/password.js';

export async function createRefreshToken(
  userId: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<string> {
  const rawToken = generateSecureToken(48);
  const lookup = hashSha256(rawToken);
  const tokenHash = await hashToken(lookup);
  const expiresAt = new Date(Date.now() + parseExpiresInToMs(env.JWT_REFRESH_EXPIRES_IN));

  await RefreshToken.create({
    user: userId,
    tokenHash,
    lookup,
    expiresAt,
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
  });

  return rawToken;
}

export async function validateRefreshToken(rawToken: string): Promise<string | null> {
  const lookup = hashSha256(rawToken);

  const record = await RefreshToken.findOne({
    lookup,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).select('+tokenHash');

  if (!record) return null;

  const isValid = await compareToken(lookup, record.tokenHash);
  return isValid ? record.user.toString() : null;
}

export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const lookup = hashSha256(rawToken);

  await RefreshToken.updateOne({ lookup, isRevoked: false }, { isRevoked: true });
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
}

export async function rotateRefreshToken(
  rawToken: string,
  meta?: { userAgent?: string; ipAddress?: string }
): Promise<{ userId: string; newToken: string } | null> {
  const userId = await validateRefreshToken(rawToken);
  if (!userId) return null;

  await revokeRefreshToken(rawToken);
  const newToken = await createRefreshToken(userId, meta);

  return { userId, newToken };
}
