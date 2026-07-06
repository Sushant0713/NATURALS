import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
  external: [
    'bcryptjs',
    'cookie-parser',
    'cors',
    'dotenv',
    'express',
    'express-rate-limit',
    'google-auth-library',
    'helmet',
    'hpp',
    'jsonwebtoken',
    'mongoose',
    'morgan',
    'nodemailer',
    'winston',
    'zod',
  ],
});
