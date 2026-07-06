export interface SafeUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  avatarUrl?: string;
  authProvider: string;
  createdAt: string;
  preferences?: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    smsNotifications: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: string;
  user: SafeUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
}
