import type { z } from 'zod';

export interface ZodTypes {
  ZodAny: z.ZodAny;
  ZodArray: z.ZodArray;
  ZodBigInt: z.ZodBigInt;
  ZodBoolean: z.ZodBoolean;
  ZodDefault: z.ZodDefault;
  ZodTransform: z.ZodTransform;
  ZodEnum: z.ZodEnum;
  ZodIntersection: z.ZodIntersection;
  ZodLiteral: z.ZodLiteral;
  ZodNever: z.ZodNever;
  ZodNull: z.ZodNull;
  ZodNullable: z.ZodNullable;
  ZodNumber: z.ZodNumber;
  ZodNonOptional: z.ZodNonOptional;
  ZodObject: z.ZodObject;
  ZodOptional: z.ZodOptional;
  ZodPipe: z.ZodPipe;
  ZodReadonly: z.ZodReadonly;
  ZodRecord: z.ZodRecord;
  ZodString: z.ZodString;
  ZodTuple: z.ZodTuple;
  ZodType: z.ZodType;
  ZodUnion: z.ZodUnion;
  ZodDiscriminatedUnion: z.ZodDiscriminatedUnion;
  ZodUnknown: z.ZodUnknown;
  ZodVoid: z.ZodVoid;
  ZodDate: z.ZodDate;
}

const ZodTypeKeys: Record<keyof ZodTypes, string> = {
  ZodAny: 'any',
  ZodArray: 'array',
  ZodBigInt: 'bigint',
  ZodBoolean: 'boolean',
  ZodDefault: 'default',
  ZodTransform: 'transform',
  ZodEnum: 'enum',
  ZodIntersection: 'intersection',
  ZodLiteral: 'literal',
  ZodNever: 'never',
  ZodNull: 'null',
  ZodNullable: 'nullable',
  ZodNumber: 'number',
  ZodNonOptional: 'nonoptional',
  ZodObject: 'object',
  ZodOptional: 'optional',
  ZodPipe: 'pipe',
  ZodReadonly: 'readonly',
  ZodRecord: 'record',
  ZodString: 'string',
  ZodTuple: 'tuple',
  ZodType: 'type',
  ZodUnion: 'union',
  ZodDiscriminatedUnion: 'union',
  ZodUnknown: 'unknown',
  ZodVoid: 'void',
  ZodDate: 'date',
};

export function isZodType<TypeName extends keyof ZodTypes>(
  schema: object,
  typeNames: TypeName[],
): schema is ZodTypes[TypeName];
export function isZodType<TypeName extends keyof ZodTypes>(
  schema: object,
  typeName: TypeName,
): schema is ZodTypes[TypeName];
export function isZodType<TypeName extends keyof ZodTypes>(
  schema: object,
  typeNames: TypeName | TypeName[],
): schema is ZodTypes[TypeName] {
  const typeNamesArray = Array.isArray(typeNames) ? typeNames : [typeNames];

  return typeNamesArray.some(typeName => {
    const typeNameMatch = (schema as z.ZodType)?.def?.type === ZodTypeKeys[typeName];

    if (typeName === 'ZodDiscriminatedUnion') {
      return typeNameMatch && 'discriminator' in (schema as z.ZodDiscriminatedUnion).def;
    }

    return typeNameMatch;
  });
}

export function isAnyZodType(schema: object): schema is z.ZodType {
  return 'def' in schema;
}

/**
 * The schema.isNullable() is deprecated. This is the suggested replacement.
 */
export function isNullableSchema(schema: z.ZodType) {
  return _isNullableSchema(schema);
}

/**
 * The schema.isOptional() is deprecated. This is the suggested replacement.
 */
export function isOptionalSchema(schema: z.ZodType) {
  return _isOptionalSchema(schema);
}

function _isNullableSchema(schema: z.ZodType): boolean {
  if (isZodType(schema, 'ZodNullable')) return true;
  if (isZodType(schema, 'ZodNonOptional')) return false;
  if (
    isZodType(schema, ['ZodOptional', 'ZodDefault', 'ZodReadonly']) &&
    isAnyZodType(schema._zod.def.innerType)
  ) {
    return _isNullableSchema(schema._zod.def.innerType);
  }
  if (isZodType(schema, 'ZodPipe')) {
    const inSchema = schema._zod.def.in;
    const outSchema = schema._zod.def.out;
    if (isZodType(inSchema, 'ZodTransform') && isAnyZodType(outSchema)) {
      return _isNullableSchema(outSchema);
    }
    if (isAnyZodType(inSchema)) {
      return _isNullableSchema(inSchema);
    }
  }
  return false;
}

function _isOptionalSchema(schema: z.ZodType): boolean {
  if (isZodType(schema, ['ZodOptional', 'ZodDefault'])) return true;
  if (isZodType(schema, 'ZodNonOptional')) return false;
  if (
    isZodType(schema, ['ZodNullable', 'ZodReadonly']) &&
    isAnyZodType(schema._zod.def.innerType)
  ) {
    return _isOptionalSchema(schema._zod.def.innerType);
  }
  if (isZodType(schema, 'ZodPipe')) {
    const inSchema = schema._zod.def.in;
    const outSchema = schema._zod.def.out;
    if (isZodType(inSchema, 'ZodTransform') && isAnyZodType(outSchema)) {
      return _isOptionalSchema(outSchema);
    }
    if (isAnyZodType(inSchema)) {
      return _isOptionalSchema(inSchema);
    }
  }
  return false;
}
