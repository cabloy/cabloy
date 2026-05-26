import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';

import { ZodMetadata } from '@cabloy/zod-openapi';

import type { SchemaLike } from '../../types/decorator.ts';

import { $makeSchema } from './makeSchemaLikes.ts';

export function $makeMetadata<T>(
  ...schemaLikes: SchemaLike<T>[]
): ISchemaObjectExtensionField | undefined {
  const schema = $makeSchema(...schemaLikes);
  return ZodMetadata.getOpenapiMetadata(schema) as ISchemaObjectExtensionField;
}
