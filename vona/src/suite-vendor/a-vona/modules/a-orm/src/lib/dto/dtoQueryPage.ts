import type { IQueryPolicy, TypeQueryEntity } from '../../types/query.ts';

import { DtoQuery } from './dtoQuery.ts';

export function DtoQueryPage<P extends IQueryPolicy, K extends keyof TypeQueryEntity<P>>(
  policy: P,
  keys: K[],
) {
  return DtoQuery(policy, keys);
}
