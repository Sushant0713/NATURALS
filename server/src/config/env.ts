import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default('localhost'),
  APP_NAME: z.string().default('RAANJAAI NATURALS'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_PREFIX: z.string().default('/api/v1'),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/raanjaai_naturals'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(10),
  JWT_ACCESS_SECRET: z.string().min(32).default('dev-access-secret-change-in-production-32chars'),
  JWT_REFRESH_SECRET: z.string().min(32).default('dev-refresh-secret-change-in-production-32ch'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default('http://localhost:4000/api/v1/auth/google/callback'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  CASHFREE_APP_ID: z.string().optional(),
  CASHFREE_SECRET_KEY: z.string().optional(),
  CASHFREE_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const config = parsed.data;

export const env = {
  ...config,
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',
  isTest: config.NODE_ENV === 'test',
  isGoogleOAuthEnabled: Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET),
  isEmailEnabled: Boolean(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS),
  isCashfreeEnabled: Boolean(config.CASHFREE_APP_ID && config.CASHFREE_SECRET_KEY),
  cashfreeBaseUrl:
    config.CASHFREE_ENV === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg',
} as const;

export type Env = typeof env;
