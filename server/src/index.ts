import 'dotenv/config';

import { createApp } from '@/app.js';
import { connectDatabase, disconnectDatabase, registerDatabaseEvents } from '@/config/database.js';
import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import '@/models/index.js';

async function bootstrap(): Promise<void> {
  registerDatabaseEvents();
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`${env.APP_NAME} API running at http://${env.HOST}:${env.PORT}${env.API_PREFIX}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      try {
        await disconnectDatabase();
        logger.info('Server shut down successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
