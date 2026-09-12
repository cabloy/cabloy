import type { RowSelectionState } from '@tanstack/vue-table';
import type { TableIdentity } from 'table-identity';
import type {
  IResourceTableActionBulkOptionsBase,
  IResourceTableSelectionPayload,
} from 'zova-module-a-openapi';

import { isNil } from '@cabloy/utils';

export const ResourceSelectedMaxIds = 100;

export function resolveSelectionMaxIds(selectedMaxIds: number | undefined): number {
  return selectedMaxIds ?? ResourceSelectedMaxIds;
}

export type TypeTableActionBulkDynamicDisabledReason = 'maxExceeded' | 'selectionUnavailable';

export interface IResourceTableActionBulkDynamicProps {
  dynamicSelection: IResourceTableSelectionPayload;
  dynamicDisabled: boolean;
  dynamicDisabledReason?: TypeTableActionBulkDynamicDisabledReason;
  selectedMaxIds?: number;
}

export function resolveTableActionBulkDynamicProps(
  options: IResourceTableActionBulkOptionsBase | undefined,
  selection: IResourceTableSelectionPayload,
  selectionAllowed: boolean,
): IResourceTableActionBulkDynamicProps {
  const requiresSelection = options?.requiresSelection === true;
  const selectedMaxIds =
    options?.selectedMaxIds !== undefined || requiresSelection
      ? resolveSelectionMaxIds(options?.selectedMaxIds)
      : undefined;
  const selectionMaxExceeded = selectedMaxIds !== undefined && selection.count > selectedMaxIds;
  return {
    dynamicSelection: selection,
    dynamicDisabled: selectionMaxExceeded || (requiresSelection && !selectionAllowed),
    dynamicDisabledReason: selectionMaxExceeded
      ? 'maxExceeded'
      : requiresSelection && !selectionAllowed
        ? 'selectionUnavailable'
        : undefined,
    selectedMaxIds,
  };
}

export function selectionKey(id: TableIdentity): string {
  if (isNil(id) || id === '') throw new Error('row id cannot empty');
  return String(id);
}

export function selectionRowId(row: Record<string, unknown>): TableIdentity {
  const id = row.id as TableIdentity;
  selectionKey(id);
  return id;
}

export function selectionRowIds(rows: readonly Record<string, unknown>[]): Set<string> {
  const ids = new Set<string>();
  for (const row of rows) {
    const id = selectionKey(selectionRowId(row));
    if (ids.has(id)) throw new Error(`duplicate row id: ${id}`);
    ids.add(id);
  }
  return ids;
}

export function reconcileSelection(
  selection: RowSelectionState,
  rows: readonly Record<string, unknown>[],
  next: RowSelectionState,
): RowSelectionState {
  const rowIds = selectionRowIds(rows);
  const result = { ...selection };
  for (const id of rowIds) {
    if (next[id]) {
      result[id] = true;
    } else {
      delete result[id];
    }
  }
  return result;
}
