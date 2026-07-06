import type { NextFunction, Request, Response } from 'express';

import { errorCodes } from '@/constants/error-codes.js';
import { userRoles } from '@/constants/enums.js';
import type { UserRole } from '@/constants/enums.js';
import { httpStatus } from '@/constants/http-status.js';
import { getUserById } from '@/services/auth.service.js';
import { AppError } from '@/utils/app-error.js';
import { verifyAccessToken } from '@/utils/jwt.js';
import { toAuthUser } from '@/utils/user-mapper.js';

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    const user = await getUserById(payload.sub);

    req.user = toAuthUser(user);
    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('Insufficient permissions', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN));
      return;
    }

    next();
  };
}

export const requireAdmin = authorize(userRoles.ADMIN, userRoles.SUPER_ADMIN);
export const requireSuperAdmin = authorize(userRoles.SUPER_ADMIN);
