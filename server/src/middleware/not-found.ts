import type { Request, Response } from 'express';

import { errorCodes } from '@/constants/error-codes.js';
import { sendError } from '@/utils/api-response.js';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, errorCodes.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`, 404);
}
