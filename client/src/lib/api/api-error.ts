import type { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, code = 'UNKNOWN_ERROR', status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromResponse(body: ApiResponse, status: number): ApiError {
    const message = body.error?.message ?? body.message ?? 'Request failed';
    const code = body.error?.code ?? 'REQUEST_FAILED';
    return new ApiError(message, code, status, body.error?.details);
  }

  static network(message = 'Network error. Please check your connection.'): ApiError {
    return new ApiError(message, 'NETWORK_ERROR', 0);
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiError) {
    if (error.code === 'VALIDATION_ERROR' && Array.isArray(error.details)) {
      const messages = error.details
        .map((d) => (typeof d === 'object' && d && 'message' in d ? String(d.message) : null))
        .filter(Boolean);
      if (messages.length > 0) return messages.join(' ');
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
