import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { AppError } from '@/utils/app-error.js';
import {
  formatZodError,
  handleCastError,
  handleMongooseValidationError,
  isDuplicateKeyError,
} from '@/utils/error-formatter.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(err.message, { code: err.code, statusCode: err.statusCode, details: err.details });

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const { message, details } = formatZodError(err);

    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: errorCodes.VALIDATION_ERROR,
        message,
        details,
      },
    });
    return;
  }

  if (isDuplicateKeyError(err)) {
    res.status(httpStatus.CONFLICT).json({
      success: false,
      error: {
        code: errorCodes.CONFLICT,
        message: 'Duplicate field value',
        details: err.keyValue,
      },
    });
    return;
  }

  if (err instanceof Error) {
    if (err.name === 'ValidationError') {
      const appError = handleMongooseValidationError(
        err as Error & { errors: Record<string, { message: string; path: string }> }
      );

      res.status(appError.statusCode).json({
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
        },
      });
      return;
    }

    if (err.name === 'CastError') {
      const appError = handleCastError(err as Error & { path: string; value: unknown });

      res.status(appError.statusCode).json({
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
        },
      });
      return;
    }
  }

  logger.error('Unhandled error', {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: errorCodes.INTERNAL_SERVER_ERROR,
      message: env.isProduction ? 'Internal server error' : (err as Error)?.message ?? 'Unknown error',
      ...(!env.isProduction &&
        err instanceof Error && { stack: err.stack }),
    },
  });
}
