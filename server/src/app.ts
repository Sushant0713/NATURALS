import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { env } from '@/config/env.js';
import { morganStream, logger } from '@/config/logger.js';
import { apiRoutes } from '@/routes/index.js';
import { errorHandler } from '@/middleware/error-handler.js';
import { notFoundHandler } from '@/middleware/not-found.js';
import { applySecurityMiddleware } from '@/middleware/security.js';

export function createApp() {
  const app = express();

  applySecurityMiddleware(app);

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    morgan(env.isDevelopment ? 'dev' : 'combined', {
      stream: morganStream,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: `${env.APP_NAME} API`,
      docs: `${env.API_PREFIX}/health`,
    });
  });

  app.use(env.API_PREFIX, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  logger.info('Express app initialized');

  return app;
}
