import type { IFilePreviewItem } from '../types/file.js';

export function inferFileRelationName(fieldName?: string, relationName?: string) {
  if (relationName) return relationName;
  if (!fieldName) return undefined;
  if (fieldName.endsWith('Ids')) {
    return `${fieldName.slice(0, -3)}s`;
  }
  if (fieldName.endsWith('Id')) {
    return fieldName.slice(0, -2);
  }
  return undefined;
}

export function resolveFileDownloadUrl(url: string | undefined, baseURL?: string) {
  if (!url || !url.startsWith('/api/')) return url;
  if (!baseURL) return url;
  return `${baseURL.replace(/\/$/, '')}${url}`;
}

export function summarizeFileRelationPreviewValue(value: unknown): {
  count: number;
  item?: IFilePreviewItem;
} {
  if (!Array.isArray(value)) {
    if (!isFilePreviewItem(value)) return { count: 0, item: undefined };
    return { count: 1, item: value };
  }
  let count = 0;
  let item: IFilePreviewItem | undefined;
  for (const valueItem of value) {
    if (!isFilePreviewItem(valueItem)) continue;
    count += 1;
    if (!item) item = valueItem;
  }
  return { count, item };
}

export function collectFileRelationPreviewItems(value: unknown): IFilePreviewItem[] {
  if (!Array.isArray(value)) {
    if (!isFilePreviewItem(value)) return [];
    return [value];
  }
  const items: IFilePreviewItem[] = [];
  for (const valueItem of value) {
    if (!isFilePreviewItem(valueItem)) continue;
    items.push(valueItem);
  }
  return items;
}

export function isFilePreviewItem(value: unknown): value is IFilePreviewItem {
  if (!value || typeof value !== 'object') return false;
  if (!('id' in value)) return false;
  return value.id !== undefined && value.id !== null && value.id !== '';
}

export function formatFileSize(size?: number) {
  if (size === undefined || size === null || Number.isNaN(size)) return '-';
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${size} B`;
}

export function formatFileDate(value?: string | Date) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}
