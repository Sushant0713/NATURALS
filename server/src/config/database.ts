import mongoose from 'mongoose';

import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.isDevelopment,
    });

    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB disconnected');
}

export function registerDatabaseEvents(): void {
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to database');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error', { error });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from database');
  });
}

export function getDatabaseStatus(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  const states: Record<number, 'connected' | 'disconnected' | 'connecting' | 'disconnecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return states[mongoose.connection.readyState] ?? 'disconnected';
}

export { mongoose };
