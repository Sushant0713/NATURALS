export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
