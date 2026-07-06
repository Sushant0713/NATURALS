import type { Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import { mongoSanitize } from '@/middleware/mongo-sanitize.js';

export function applySecurityMiddleware(app: Express): void {
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(mongoSanitize);
  app.use(hpp());
}
