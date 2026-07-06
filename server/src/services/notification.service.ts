import { Types } from 'mongoose';

import { notificationTypes } from '@/constants/enums.js';
import { Notification } from '@/models/notification.model.js';

export async function createNotification(input: {
  userId: string;
  type: (typeof notificationTypes)[keyof typeof notificationTypes];
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}) {
  return Notification.create({
    user: new Types.ObjectId(input.userId),
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
    data: input.data ?? {},
  });
}

export async function createOrderNotification(userId: string, orderNumber: string, total: number) {
  return createNotification({
    userId,
    type: notificationTypes.ORDER_UPDATE,
    title: 'Order Confirmed',
    message: `Your order ${orderNumber} for ₹${total} has been confirmed. We're preparing it with care.`,
    link: `/orders/${orderNumber}`,
    data: { orderNumber, total },
  });
}

export async function createWelcomeNotification(userId: string, name: string) {
  const existing = await Notification.findOne({ user: userId, type: notificationTypes.ACCOUNT });
  if (existing) return existing;

  return createNotification({
    userId,
    type: notificationTypes.ACCOUNT,
    title: 'Welcome to RAANJAAI NATURALS',
    message: `Hi ${name}! Explore our organic and heritage foods — nature's bounty in every grain.`,
    link: '/products',
  });
}
