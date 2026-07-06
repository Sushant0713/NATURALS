import type { Document, Types } from 'mongoose';

import type { NotificationType } from '@/constants/enums.js';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  link?: string;
  isUnread?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
