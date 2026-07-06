import type { UserRole } from '@/constants/enums.js';

export interface AccessTokenPayload {
  sub: string;
  email?: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  email?: string;
  role: UserRole;
}

export interface SafeUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  authProvider: string;
  createdAt: Date;
  preferences?: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    smsNotifications: boolean;
  };
}

export interface AuthTokensResponse {
  accessToken: string;
  expiresIn: string;
  user: SafeUser;
}

export interface AuthSessionResult extends AuthTokensResponse {
  refreshToken: string;
}
