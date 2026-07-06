import { Router } from 'express';

import {
  adminLoginHandler,
  forgotPasswordHandler,
  getMe,
  googleAuth,
  googleCallback,
  googleTokenLogin,
  login,
  logout,
  refresh,
  register,
  resetPasswordHandler,
} from '@/controllers/auth.controller.js';
import { authenticate } from '@/middleware/auth.js';
import { authRateLimiter } from '@/middleware/rate-limiter.js';
import { validate } from '@/middleware/validate.js';
import {
  forgotPasswordSchema,
  googleTokenSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/validators/auth.validator.js';

export const authRouter = Router();

authRouter.use(authRateLimiter);

authRouter.post('/register', validate({ body: registerSchema }), register);
authRouter.post('/login', validate({ body: loginSchema }), login);
authRouter.post('/admin/login', validate({ body: loginSchema }), adminLoginHandler);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
authRouter.post('/forgot-password', validate({ body: forgotPasswordSchema }), forgotPasswordHandler);
authRouter.post('/reset-password', validate({ body: resetPasswordSchema }), resetPasswordHandler);
authRouter.get('/me', authenticate, getMe);

authRouter.get('/google', googleAuth);
authRouter.get('/google/callback', googleCallback);
authRouter.post('/google/token', validate({ body: googleTokenSchema }), googleTokenLogin);
