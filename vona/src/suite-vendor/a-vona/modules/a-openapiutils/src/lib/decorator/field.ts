import type { MetadataKey } from 'vona';
import type { SchemaLike } from 'vona-module-a-openapiutils';

import { appMetadata } from 'vona';

import { makeSchemaLikes } from '../schema/makeSchemaLikes.ts';
import { v } from '../schema/v.ts';
import { mergeFieldOpenapiMetadata } from '../utils.ts';

export function Field(...schemaLikes: SchemaLike[]): PropertyDecorator {
  return function (target: object, prop: MetadataKey, descriptor?: PropertyDescriptor) {
    const metaType = appMetadata.getDesignType(target, prop);
    const schema = makeSchemaLikes(schemaLikes, metaType);
    const rules = mergeFieldOpenapiMetadata(target, prop as string, schema);
    if (descriptor?.get) {
      rules[prop as string] = v.serializerGetter(descriptor.get)(rules[prop as string]!);
    }
  };
}
