import rateLimit from 'express-rate-limit';

import { env } from '@/config/env.js';
import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: errorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many requests, please try again later',
    },
  },
  statusCode: httpStatus.TOO_MANY_REQUESTS,
});

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: errorCodes.RATE_LIMIT_EXCEEDED,
      message: 'Too many authentication attempts, please try again later',
    },
  },
  statusCode: httpStatus.TOO_MANY_REQUESTS,
});
