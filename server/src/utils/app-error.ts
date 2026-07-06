import { errorCodes } from '@/constants/error-codes.js';
import { httpStatus } from '@/constants/http-status.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    code: string = errorCodes.INTERNAL_SERVER_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
