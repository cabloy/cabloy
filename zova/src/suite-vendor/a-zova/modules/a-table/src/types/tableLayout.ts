import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import { TableColumnIdSelection } from './table.js';

export type TypeTableLayoutWidth = number | 'auto';

export interface ITableLayoutColumn {
  key: string;
  visible: boolean;
  width: TypeTableLayoutWidth;
}

export interface ITableLayout {
  version: 1;
  schemaFingerprint?: string;
  columns: ITableLayoutColumn[];
}

export interface ITableLayoutProfileLike {
  version?: unknown;
  schemaFingerprint?: unknown;
  columns?: unknown;
}

function isWidth(value: unknown): value is TypeTableLayoutWidth {
  return (
    value === 'auto' ||
    (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 2000)
  );
}

/**
 * Reconciles a persisted layout with the currently eligible schema columns.
 * Schema visibility and fixed regions always remain authoritative.
 */
export function reconcileTableLayout(
  properties: readonly ISchemaObjectExtensionField[],
  profile?: ITableLayoutProfileLike | ITableLayout,
): ITableLayout {
  const entries = new Map<string, ITableLayoutColumn>();
  const profileColumns = Array.isArray(profile?.columns) ? profile.columns : [];
  for (const item of profileColumns) {
    if (!item || typeof item !== 'object') continue;
    const column = item as Record<string, unknown>;
    const key = typeof column.key === 'string' ? column.key.trim() : '';
    if (!key || entries.has(key)) continue;
    if (typeof column.visible !== 'boolean' || !isWidth(column.width)) continue;
    entries.set(key, { key, visible: column.visible, width: column.width });
  }

  const eligible = properties.filter(
    property =>
      typeof property.key === 'string' && property.key && property.key !== TableColumnIdSelection,
  );
  const schemaKeys = new Set(eligible.map(property => property.key!));
  const regions = new Map<'left' | 'center' | 'right', ISchemaObjectExtensionField[]>();
  regions.set('left', []);
  regions.set('center', []);
  regions.set('right', []);
  for (const property of eligible) {
    const fixed = property.rest?.fixed;
    regions.get(fixed === 'left' ? 'left' : fixed === 'right' ? 'right' : 'center')!.push(property);
  }

  const result: ITableLayoutColumn[] = [];
  for (const region of ['left', 'center', 'right'] as const) {
    const regionProperties = regions.get(region)!;
    const regionKeys = new Set(regionProperties.map(property => property.key!));
    const ordered = profileColumns
      .map(item =>
        item && typeof item === 'object' ? (item as Record<string, unknown>) : undefined,
      )
      .filter(item => {
        const key = typeof item?.key === 'string' ? item.key.trim() : '';
        return !!key && regionKeys.has(key) && schemaKeys.has(key) && entries.get(key)?.key === key;
      })
      .map(item => item!.key as string);
    const seen = new Set<string>();
    for (const key of [...ordered, ...regionProperties.map(property => property.key!)]) {
      if (seen.has(key)) continue;
      seen.add(key);
      const property = regionProperties.find(item => item.key === key)!;
      const entry = entries.get(key);
      const schemaWidth = property.rest?.width;
      result.push({
        key,
        visible: entry?.visible ?? true,
        width:
          entry?.width ??
          (typeof schemaWidth === 'number' && schemaWidth > 0 ? schemaWidth : 'auto'),
      });
    }
  }
  return {
    version: 1,
    ...(typeof profile?.schemaFingerprint === 'string'
      ? { schemaFingerprint: profile.schemaFingerprint }
      : {}),
    columns: result,
  };
}
