export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'RAANJAAI NATURALS',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '8767047134',
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? '@RAANJAAINATURALS',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
