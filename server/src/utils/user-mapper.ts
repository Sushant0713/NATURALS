import type { IUser } from '@/types/models/user.types.js';
import type { AuthUser, SafeUser } from '@/types/auth.js';

export function toSafeUser(user: IUser): SafeUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
    createdAt: user.createdAt,
    preferences: user.preferences,
  };
}

export function toAuthUser(user: IUser): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}
