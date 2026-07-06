import type { Response } from 'express';

import { httpStatus } from '@/constants/http-status.js';
import type { ApiResponse } from '@/types/api.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = httpStatus.OK
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
  details?: unknown
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };

  return res.status(statusCode).json(response);
}
