import type { TableIdentity } from 'table-identity';

import { isNil } from '@cabloy/utils';

export function validateSelectedIds(ids: readonly TableIdentity[]): TableIdentity[] {
  if (ids.length === 0) throw new Error('selected ids cannot empty');
  const keys = new Set<string>();
  for (const id of ids) {
    if (isNil(id) || id === '') throw new Error('selected row id cannot empty');
    const key = String(id);
    if (keys.has(key)) throw new Error(`duplicate selected row id: ${key}`);
    keys.add(key);
  }
  return [...ids];
}
