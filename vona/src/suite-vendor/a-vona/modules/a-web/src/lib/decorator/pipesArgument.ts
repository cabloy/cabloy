import type { MetadataKey } from 'vona';
import type { RouteHandlerArgumentType, TypeExtractValue } from 'vona-module-a-openapi';
import type { SchemaLike } from 'vona-module-a-openapiutils';

import { appMetadata } from 'vona';
import { setArgumentPipe } from 'vona-module-a-aspect';
import { makeSchemaLikes } from 'vona-module-a-openapiutils';
import { z } from 'zod';

export function createPipesArgumentDecorator(
  paramType: RouteHandlerArgumentType,
  extractValue?: TypeExtractValue,
) {
  return function (field?: string | SchemaLike, ...schemaLikes: SchemaLike[]): ParameterDecorator {
    return function (target: object, prop: MetadataKey | undefined, index: number) {
      const hasParamField = typeof field === 'string';
      const paramField = hasParamField ? field : undefined;
      const paramSchemaLikes = hasParamField
        ? schemaLikes
        : [field!, ...schemaLikes].filter(item => !!item);

      const paramtypes = appMetadata.getMetadata<any[]>('design:paramtypes', target, prop)!;
      let metaType;
      if (paramType === 'file') {
        metaType = z.string().openapi({ format: 'binary' });
      } else if (paramType === 'files') {
        metaType = z.array(z.string().openapi({ format: 'binary' }));
      } else {
        metaType = paramtypes[index];
      }

      const argSchema = makeSchemaLikes(paramSchemaLikes, metaType);

      setArgumentPipe(
        'a-web:valid',
        {
          type: paramType,
          field: paramField,
          schema: argSchema,
          extractValue,
        },
        target,
        prop,
        index,
      );
    };
  };
}
