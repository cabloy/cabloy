import type { TableIdentity } from 'table-identity';

import { isNil } from '@cabloy/utils';

export type TypeResourcePickerSelectionMode = 'single' | 'multiple';

export function normalizeResourcePickerIds(value: unknown): TableIdentity[] {
  const values = Array.isArray(value) ? value : isNil(value) || value === '' ? [] : [value];
  const ids: TableIdentity[] = [];
  const keys = new Set<string>();
  for (const value of values) {
    if (isNil(value) || value === '') continue;
    const id = value as TableIdentity;
    const key = String(id);
    if (keys.has(key)) continue;
    keys.add(key);
    ids.push(id);
  }
  return ids;
}

export function resolveResourcePickerValue(
  value: unknown,
  selectionMode: TypeResourcePickerSelectionMode,
  selectionMax: number,
): TableIdentity | TableIdentity[] | undefined {
  const selectedIds = normalizeResourcePickerIds(value).slice(0, selectionMax);
  return selectionMode === 'single' ? selectedIds[0] : selectedIds;
}
