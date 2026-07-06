import { Schema, model } from 'mongoose';

import { notificationTypes } from '@/constants/enums.js';
import { createSchema } from '@/models/base.model.js';
import type { INotification } from '@/types/models/notification.types.js';

const notificationSchema = createSchema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(notificationTypes),
        message: 'Invalid notification type',
      },
      required: [true, 'Notification type is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    link: {
      type: String,
      trim: true,
      maxlength: [500, 'Link cannot exceed 500 characters'],
    },
  },
  {
    collection: 'notifications',
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL: 90 days

notificationSchema.virtual('isUnread').get(function (this: INotification) {
  return !this.isRead;
});

export const Notification = model<INotification>('Notification', notificationSchema);
