import { createHash, randomBytes } from 'crypto';

export function generateSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

export function hashSha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
