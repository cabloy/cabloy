import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IRbacScopeAccess } from '../types/scope.ts';

export type TypeRbacResourceBulkLoad<Entry extends { id: TableIdentity }> = (
  ids: readonly TableIdentity[],
) => Promise<Entry[]>;

@Bean()
export class BeanRbacResourceBulk extends BeanBase {
  async entries<Entry extends { id: TableIdentity }>(
    ids: readonly TableIdentity[],
    load: TypeRbacResourceBulkLoad<Entry>,
    access: IRbacScopeAccess,
  ): Promise<Entry[]> {
    const requested = this.validateIds(ids);
    const entries = await load(requested);
    const entriesByKey = new Map(entries.map(entry => [this.idKey(entry.id), entry]));
    if (
      entries.length !== requested.length ||
      requested.some(id => !entriesByKey.has(this.idKey(id)))
    ) {
      this.scope.error.ResourceBulkEntriesMissing.throw();
    }
    const orderedEntries = requested.map(id => entriesByKey.get(this.idKey(id))!);
    access.checkEntries(orderedEntries);
    return orderedEntries;
  }

  private validateIds(ids: readonly TableIdentity[]): TableIdentity[] {
    if (ids.length === 0) this.scope.error.ResourceBulkIdsEmpty.throw();
    const keys = new Set<string>();
    for (const id of ids) {
      const key = this.idKey(id);
      if (keys.has(key)) this.scope.error.ResourceBulkIdsDuplicate.throw();
      keys.add(key);
    }
    return [...ids];
  }

  private idKey(id: TableIdentity): string {
    if (id === undefined || id === null || id === '') {
      this.scope.error.ResourceBulkIdsInvalid.throw();
    }
    return String(id);
  }
}
