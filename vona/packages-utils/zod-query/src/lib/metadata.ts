import type z from 'zod';

import type { ZodTypes } from './zod-is-type.ts';

import { isAnyZodType, isZodType } from './zod-is-type.ts';

export class Metadata {
  static unwrapUntil(schema: z.ZodType): z.ZodType;
  static unwrapUntil<TypeName extends keyof ZodTypes>(
    schema: z.ZodType,
    typeName: TypeName | undefined,
  ): ZodTypes[TypeName] | undefined;
  static unwrapUntil<TypeName extends keyof ZodTypes>(
    schema: z.ZodType,
    typeName?: TypeName,
  ): z.ZodType | undefined {
    if (typeName && isZodType(schema, typeName)) {
      return schema;
    }

    if (
      isZodType(schema, [
        'ZodOptional',
        'ZodNullable',
        'ZodDefault',
        'ZodReadonly',
        'ZodNonOptional',
      ]) &&
      isAnyZodType(schema._zod.def.innerType)
    ) {
      return this.unwrapUntil(schema._zod.def.innerType, typeName);
    }

    if (isZodType(schema, 'ZodPipe')) {
      const inSchema = schema._zod.def.in;
      const outSchema = schema._zod.def.out;

      // meaning preprocess
      if (isZodType(inSchema, 'ZodTransform') && isAnyZodType(outSchema)) {
        return this.unwrapUntil(outSchema, typeName);
      }

      // meaning transform
      if (isAnyZodType(inSchema)) {
        return this.unwrapUntil(inSchema, typeName);
      }
    }

    return typeName ? undefined : schema;
  }
}
