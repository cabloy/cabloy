import type { ZodTypes } from '@cabloy/zod-to-openapi/dist/lib/zod-is-type.js';
import type { ZodOpenAPIInternalMetadata } from '@cabloy/zod-to-openapi/dist/zod-extensions.js';
import type z from 'zod';

import { isZodType, Metadata } from '@cabloy/zod-to-openapi';

export class ZodMetadata {
  static unwrapUntil(schema, typeName?) {
    return (Metadata as any).unwrapUntil(schema, typeName);
  }

  static unwrapChained<T extends z.ZodType | undefined>(
    schema?: T,
  ): T extends undefined ? undefined : z.ZodType {
    if (!schema) return undefined as any;
    return Metadata.unwrapChained(schema) as any;
  }

  static getDefaultValue<T>(zodSchema: z.ZodType): T | undefined {
    return Metadata.getDefaultValue(zodSchema);
  }

  static getInternalMetadata<T>(zodSchema: z.ZodType<T>): ZodOpenAPIInternalMetadata | undefined {
    return Metadata.getInternalMetadata(zodSchema);
  }

  static getLazySchema<T>(zodSchema: z.ZodType<T>) {
    const innerSchema = this.unwrapChained(zodSchema) as z.ZodLazy;
    return (zodSchema as z.ZodLazy)._zod.def.getter ?? innerSchema._zod.def.getter;
  }

  static resolveLazySchema<T>(zodSchema: z.ZodType<T>) {
    const getter = this.getLazySchema(zodSchema);
    if (!getter) return zodSchema;
    // metadata: first
    const metadata = this.getOpenapiMetadata(zodSchema);
    zodSchema = getter() as z.ZodType<T>;
    return metadata ? zodSchema.openapi(metadata) : zodSchema;
  }

  static getRefId<T>(zodSchema: z.ZodType<T>): string | undefined {
    return Metadata.getRefId(zodSchema);
  }

  static getFieldSchema(zodSchema: z.ZodType | undefined, key: string): z.ZodType | undefined {
    if (!zodSchema) return;
    const parts = key.split('.');
    for (const part of parts) {
      zodSchema = this._getFieldSchemaInner(zodSchema, part);
      if (!zodSchema) break;
    }
    return zodSchema;
  }

  static _getFieldSchemaInner(
    zodSchema: z.ZodType | undefined,
    key: string,
  ): z.ZodType | undefined {
    if (!zodSchema) return;
    zodSchema = this.unwrapChained(zodSchema);
    let schema;
    if (zodSchema.def.type === 'object') {
      schema = zodSchema;
    } else if (zodSchema.def.type === 'union') {
      schema = (zodSchema as z.ZodUnion<any>).def.options.find(item => item.def.type === 'object');
    } else {
      throw new Error('invalid zod schema');
    }
    return schema.shape[key];
  }

  static getOpenapiMetadata<T>(zodSchema: z.ZodType<T>) {
    return Metadata.getOpenApiMetadata(zodSchema);
  }

  static isZodType<TypeName extends keyof ZodTypes>(
    schema: object,
    typeNames: TypeName[],
  ): schema is ZodTypes[TypeName];
  static isZodType<TypeName extends keyof ZodTypes>(
    schema: object,
    typeName: TypeName,
  ): schema is ZodTypes[TypeName];
  static isZodType<TypeName extends keyof ZodTypes>(
    schema: object,
    typeNames: TypeName | TypeName[],
  ): boolean {
    return isZodType(schema, typeNames as any);
  }
}
