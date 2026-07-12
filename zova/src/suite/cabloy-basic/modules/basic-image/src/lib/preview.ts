import { $protocolKey } from 'zova';

export interface IImagePreviewItemBase {
  url?: string;
  filename?: string;
}

export interface IImagePreviewItem extends IImagePreviewItemBase {
  url: string;
}

export function inferImageRelationName(fieldName?: string, relationName?: string) {
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

export function resolveImagePreviewUrl(
  url: string | undefined,
  baseURL?: string,
  passportCode?: string,
) {
  if (!url) return url;
  const resolvedUrl =
    url.startsWith('/api/') && baseURL ? `${baseURL.replace(/\/$/, '')}${url}` : url;
  if (!passportCode) return resolvedUrl;
  const apiBaseUrl = new URL(baseURL ?? 'http://localhost', 'http://localhost');
  const parsedUrl = new URL(resolvedUrl, apiBaseUrl);
  if (parsedUrl.origin !== apiBaseUrl.origin || !parsedUrl.pathname.startsWith('/api/')) {
    return resolvedUrl;
  }
  const passportCodeKey = $protocolKey('x-vona-passport-code');
  if (!parsedUrl.searchParams.has(passportCodeKey)) {
    parsedUrl.searchParams.set(passportCodeKey, passportCode);
  }
  if (!baseURL) return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  return parsedUrl.toString();
}

export function buildImagePreviewTitle(
  fieldTitle: string | undefined,
  count: number,
  fallbackTitle: string | (() => string),
) {
  const normalizedTitle =
    fieldTitle ?? (typeof fallbackTitle === 'function' ? fallbackTitle() : fallbackTitle);
  if (count <= 1) return normalizedTitle;
  return `${normalizedTitle}（${count}）`;
}

export function summarizeImageRelationPreviewValue(value: unknown): {
  count: number;
  item?: IImagePreviewItem;
} {
  if (!Array.isArray(value)) {
    if (!isImagePreviewItem(value)) return { count: 0, item: undefined };
    return { count: 1, item: value };
  }
  let count = 0;
  let item: IImagePreviewItem | undefined;
  for (const valueItem of value) {
    if (!isImagePreviewItem(valueItem)) continue;
    count += 1;
    if (!item) item = valueItem;
  }
  return { count, item };
}

export function summarizeImageUrlPreviewValue(value: unknown): {
  count: number;
  item?: IImagePreviewItem;
} {
  if (!Array.isArray(value)) {
    if (!value) return { count: 0, item: undefined };
    return { count: 1, item: { url: String(value) } };
  }
  let count = 0;
  let item: IImagePreviewItem | undefined;
  for (const valueItem of value) {
    if (!valueItem) continue;
    count += 1;
    if (!item) item = { url: String(valueItem) };
  }
  return { count, item };
}

export function collectImageRelationPreviewItems(value: unknown): IImagePreviewItem[] {
  if (!Array.isArray(value)) {
    if (!isImagePreviewItem(value)) return [];
    return [value];
  }
  const items: IImagePreviewItem[] = [];
  for (const valueItem of value) {
    if (!isImagePreviewItem(valueItem)) continue;
    items.push(valueItem);
  }
  return items;
}

export function collectImageUrlPreviewItems(value: unknown): IImagePreviewItem[] {
  if (!Array.isArray(value)) {
    if (!value) return [];
    return [{ url: String(value) }];
  }
  const items: IImagePreviewItem[] = [];
  for (const valueItem of value) {
    if (!valueItem) continue;
    items.push({ url: String(valueItem) });
  }
  return items;
}

export function isImagePreviewItem(value: unknown): value is IImagePreviewItem {
  if (!value || typeof value !== 'object') return false;
  if (!('url' in value)) return false;
  return typeof value.url === 'string' && !!value.url;
}
