import winston from 'winston';

import { env } from '@/config/env.js';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} [${level}]: ${message}${metaString}`;
  })
);

const prodFormat = combine(errors({ stack: true }), timestamp(), json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.isProduction ? prodFormat : devFormat,
  defaultMeta: { service: 'raanjaai-api' },
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
