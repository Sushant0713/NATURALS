import nodemailer from 'nodemailer';

import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';

function createTransporter() {
  if (!env.isEmailEnabled) return null;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: (env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  if (!env.isEmailEnabled) {
    if (env.isDevelopment) {
      logger.info(`Password reset link for ${email}: ${resetUrl}`);
    }
    return;
  }

  const transporter = createTransporter();
  if (!transporter) return;

  await transporter.sendMail({
    from: env.SMTP_FROM ?? env.SMTP_USER,
    to: email,
    subject: `${env.APP_NAME} — Reset Your Password`,
    html: `
      <p>You requested a password reset for your ${env.APP_NAME} account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
    `,
  });
}
