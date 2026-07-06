import type { Request, Response } from 'express';

import { brand } from '@/constants/brand.js';
import { getHealthStatus } from '@/services/health.service.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { sendSuccess } from '@/utils/api-response.js';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const health = getHealthStatus();

  sendSuccess(res, health, `${brand.name} API is running`);
});
