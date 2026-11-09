import { $Class } from 'vona';
import { Api } from 'vona-module-a-openapiutils';

import type { IQueryPolicy, TypeQueryEntity, TypeQueryInput } from '../../types/query.ts';

import { SymbolQueryPolicy } from '../../types/query.ts';
import { queryControlSchemas } from '../query/schema.ts';

export function DtoQuery<P extends IQueryPolicy, K extends keyof TypeQueryEntity<P>>(
  policy: P,
  keys: K[],
) {
  class Controls {}
  Object.defineProperty(Controls, SymbolQueryPolicy, { value: policy });
  for (const [name, schema] of Object.entries(queryControlSchemas(policy))) {
    Api.field(schema)(Controls.prototype, name);
  }
  const target = $Class.mixin(
    Controls,
    $Class.partial(
      $Class.pick(policy.entityClass as new () => Record<string, unknown>, keys as string[]),
    ),
  );
  Object.defineProperty(target, SymbolQueryPolicy, { value: policy });
  return target as new () => TypeQueryInput<P> & Partial<Pick<TypeQueryEntity<P>, K>>;
}
