import type {
  ISerializerTransformOptionsCustom,
  ISerializerTransformOptionsExclude,
  ISerializerTransformOptionsGetter,
  ISerializerTransformRecord,
  TypeSerializerTransformCustom,
  TypeSerializerTransformGetter,
} from 'vona-module-a-serialization';
import type z from 'zod';

export function schemaSerializerTransform<T extends keyof ISerializerTransformRecord>(
  serializerTransformName: T,
  options?: Partial<ISerializerTransformRecord[T]>,
) {
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      serializerTransforms: {
        [serializerTransformName]: options,
      },
    });
  };
}

export function schemaSerializerExclude(options: Partial<ISerializerTransformOptionsExclude>);
export function schemaSerializerExclude(exclude?: boolean);
export function schemaSerializerExclude(
  param?: boolean | Partial<ISerializerTransformOptionsExclude>,
) {
  let options: Partial<ISerializerTransformOptionsExclude>;
  if (!param || typeof param === 'boolean') {
    options = { exclude: param };
  } else {
    options = param;
  }
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      serializerTransforms: {
        'a-serialization:exclude': options,
      },
    });
  };
}

export function schemaSerializerReplace(
  options: ISerializerTransformRecord['a-serialization:replace'],
) {
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      serializerTransforms: {
        'a-serialization:replace': options,
      },
    });
  };
}

export function schemaSerializerGetter(options: Partial<ISerializerTransformOptionsGetter>);
export function schemaSerializerGetter(getter: TypeSerializerTransformGetter);
export function schemaSerializerGetter(
  param: TypeSerializerTransformGetter | Partial<ISerializerTransformOptionsGetter>,
) {
  let options: Partial<ISerializerTransformOptionsGetter>;
  if (typeof param === 'function') {
    options = { getter: param };
  } else {
    options = param;
  }
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      serializerTransforms: {
        'a-serialization:getter': options,
      },
    });
  };
}

export function schemaSerializerCustom(options: Partial<ISerializerTransformOptionsCustom>);
export function schemaSerializerCustom(getter: TypeSerializerTransformCustom);
export function schemaSerializerCustom(
  param: TypeSerializerTransformCustom | Partial<ISerializerTransformOptionsCustom>,
) {
  let options: Partial<ISerializerTransformOptionsCustom>;
  if (typeof param === 'function') {
    options = { custom: param };
  } else {
    options = param;
  }
  return function (schema: z.ZodType): z.ZodType {
    return schema.openapi({
      serializerTransforms: {
        'a-serialization:custom': options,
      },
    });
  };
}
