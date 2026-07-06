import { Schema, type SchemaDefinition, type SchemaOptions } from 'mongoose';

export const defaultSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      if (ret._id) {
        ret.id = String(ret._id);
        delete ret._id;
      }
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  },
} satisfies SchemaOptions;

export function createSchema(
  definition: SchemaDefinition,
  options?: SchemaOptions
): Schema {
  return new Schema(definition, {
    ...defaultSchemaOptions,
    ...options,
  });
}
