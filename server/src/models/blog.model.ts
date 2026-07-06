import { Schema, model } from 'mongoose';

import { createSchema } from '@/models/base.model.js';
import type { IBlog } from '@/types/models/blog.types.js';

const blogSchema = createSchema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title cannot exceed 70 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
  },
  {
    collection: 'blogs',
  }
);

blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

blogSchema.virtual('estimatedReadTime').get(function (this: IBlog) {
  const wordsPerMinute = 200;
  const wordCount = this.content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
});

export const Blog = model<IBlog>('Blog', blogSchema);
