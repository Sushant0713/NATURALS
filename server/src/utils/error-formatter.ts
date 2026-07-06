import type { ZodError } from 'zod';

import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';
import { AppError } from '@/utils/app-error.js';

export function formatZodError(error: ZodError): { message: string; details: unknown } {
  const details = error.errors.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));

  return {
    message: 'Validation failed',
    details,
  };
}

export function isDuplicateKeyError(error: unknown): error is { code: number; keyValue: Record<string, unknown> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  );
}

export function handleMongooseValidationError(error: {
  errors: Record<string, { message: string; path: string }>;
}): AppError {
  const details = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));

  return new AppError(
    'Database validation failed',
    httpStatus.BAD_REQUEST,
    errorCodes.VALIDATION_ERROR,
    details
  );
}

export function handleCastError(error: { path: string; value: unknown }): AppError {
  return new AppError(
    `Invalid value for field "${error.path}"`,
    httpStatus.BAD_REQUEST,
    errorCodes.BAD_REQUEST,
    { field: error.path, value: error.value }
  );
}
