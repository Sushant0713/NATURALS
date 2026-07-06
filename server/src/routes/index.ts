import { Router } from 'express';

import { apiRateLimiter } from '@/middleware/rate-limiter.js';
import { adminRouter } from '@/routes/admin.routes.js';
import { authRouter } from '@/routes/auth.routes.js';
import { accountRouter } from '@/routes/account.routes.js';
import { checkoutRouter } from '@/routes/checkout.routes.js';
import { healthRouter } from '@/routes/health.routes.js';

export const apiRoutes = Router();

apiRoutes.use(apiRateLimiter);
apiRoutes.use('/health', healthRouter);
apiRoutes.use('/auth', authRouter);
apiRoutes.use('/checkout', checkoutRouter);
apiRoutes.use('/account', accountRouter);
apiRoutes.use('/admin', adminRouter);
