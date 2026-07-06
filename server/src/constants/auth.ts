export const authProviders = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;

export type AuthProvider = (typeof authProviders)[keyof typeof authProviders];

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
