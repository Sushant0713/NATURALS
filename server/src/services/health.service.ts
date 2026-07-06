import { brand } from '@/constants/brand.js';
import { env } from '@/config/env.js';
import { getDatabaseStatus } from '@/config/database.js';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  app: string;
  environment: string;
  version: string;
  timestamp: string;
  uptime: number;
  database: ReturnType<typeof getDatabaseStatus>;
}

export function getHealthStatus(): HealthStatus {
  const database = getDatabaseStatus();

  return {
    status: database === 'connected' ? 'ok' : 'degraded',
    app: brand.name,
    environment: env.NODE_ENV,
    version: env.API_PREFIX,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database,
  };
}
