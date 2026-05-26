import type { Constructable, ILocaleMagic } from 'vona';
import type { ISchemaObjectOptions } from 'vona-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { coerceWithNil } from '@cabloy/zod-query';
import { z } from 'zod';

import type { SchemaLike } from '../../../types/decorator.ts';

import { $locale } from '../../../.metadata/locales.ts';
import { normalizeErrorParams } from '../../utils.ts';
import { $schema, $schemaLazy, makeSchemaLike } from '../makeSchemaLikes.ts';
import { _generalSchemaRest } from './utils.ts';

export function schemaDefault(defaultValue: any | Function) {
  return function (schema: z.ZodType): z.ZodType {
    return schema.default(defaultValue);
  };
}

export function schemaOptional() {
  return schemaRequired(false);
}

export function schemaRequired(
  required: boolean = true,
  params?: string | ILocaleMagic | z.core.$ZodStringParams,
) {
  const errorDefault = { error: () => $locale('ZodErrorRequired') };
  return function (schema: z.ZodType): z.ZodType {
    const options = { required };
    if (required) {
      schema._zod.def.error = normalizeErrorParams(params, errorDefault).error;
      return _generalSchemaRest(schema, options, 'form');
    } else {
      return _generalSchemaRest(schema.optional(), options, 'form');
    }
  };
}

export function schemaLazy<T>(...schemaLikes: SchemaLike<T>[]) {
  return function (_schema?: z.ZodType): z.ZodType<T> {
    return $schemaLazy(...schemaLikes);
  };
}

export function schemaObject<T>(classType: Constructable<T>, options?: ISchemaObjectOptions) {
  return function (_schema?: z.ZodType): z.ZodType<T> {
    return $schema(classType, options);
  };
}

export function schemaArray(
  schemaLike?: SchemaLike,
  params?: z.core.$ZodArrayParams & { separator?: string },
) {
  return function (schema: z.ZodType): z.ZodType {
    return z.preprocess(
      val => {
        val = coerceWithNil(val);
        if (isNil(val)) return val;
        if (typeof val !== 'string') return val;
        if (val.startsWith('[') && val.endsWith(']')) return JSON.parse(val);
        return val.split(params?.separator ?? ',');
      },
      z.array(makeSchemaLike(schemaLike ?? schema, z.any()), params),
      // z.array(makeSchemaLike(schemaLike, schema), params),
    );
  };
}

export function schemaStrictObject() {
  return function (schema: z.ZodObject): z.ZodObject {
    return z.strictObject(schema.shape);
  };
}

export function schemaLooseObject() {
  return function (schema: z.ZodObject): z.ZodObject {
    return z.looseObject(schema.shape);
  };
}
