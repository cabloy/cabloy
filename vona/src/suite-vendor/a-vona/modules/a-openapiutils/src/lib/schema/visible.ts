import type { TypeSchemaScene } from 'vona-module-a-openapi';
import type z from 'zod';

import { _generalSchemaRest } from './v/utils.ts';

export function schemaRenderVisible<T extends z.ZodType>(
  visible?: boolean,
  scene?: TypeSchemaScene,
) {
  return function (schema: T): T {
    const options = { visible };
    return _generalSchemaRest(schema, options, scene);
  };
}
