import type { NextFunction, Request, Response } from 'express';

import { sanitizeObject } from '@/utils/sanitize.js';

export function mongoSanitize(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
}
