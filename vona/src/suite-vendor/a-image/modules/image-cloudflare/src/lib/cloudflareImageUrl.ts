import type {
  IImageDeliveryOptions,
  IImageTransformOptions,
  TypeImageVariantName,
} from 'vona-module-a-image';

import { createHmac } from 'node:crypto';

export interface ICloudflareImageUrlOptions extends IImageDeliveryOptions {
  accountHash?: string;
  deliveryBaseUrl?: string;
  signingKey?: string;
}

export function buildCloudflareImageUrl(
  resourceId: string,
  variantName: TypeImageVariantName | 'custom',
  transformOptions: IImageTransformOptions,
  options: ICloudflareImageUrlOptions,
) {
  const baseUrl = resolveCloudflareDeliveryBaseUrl(options);
  const resourcePath = encodeCloudflareResourceId(resourceId);
  const variantPath =
    variantName === 'custom'
      ? buildCloudflareTransformPath(transformOptions)
      : normalizeCloudflareVariantName(variantName);
  const url = new URL(`${baseUrl}/${resourcePath}/${variantPath}`);
  if (options.signed) {
    signCloudflareImageUrl(url, options);
  }
  return url.toString();
}

export function resolveCloudflareDeliveryBaseUrl(options: {
  accountHash?: string;
  deliveryBaseUrl?: string;
}) {
  if (options.deliveryBaseUrl) {
    return options.deliveryBaseUrl.replace(/\/$/, '');
  }
  if (!options.accountHash) {
    throw new Error('Cloudflare accountHash or deliveryBaseUrl is required');
  }
  return `https://imagedelivery.net/${options.accountHash}`;
}

export function resolveCloudflareDeliveryBaseUrlFromVariantUrl(url?: string) {
  if (!url) return undefined;
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 2) return undefined;
  return `${parsed.origin}/${segments[0]}`;
}

export function encodeCloudflareResourceId(resourceId: string) {
  return resourceId
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

export function buildCloudflareTransformPath(transformOptions: IImageTransformOptions) {
  const entries: Array<[string, string | number]> = [];
  if (transformOptions.width !== undefined) entries.push(['w', transformOptions.width]);
  if (transformOptions.height !== undefined) entries.push(['h', transformOptions.height]);
  if (transformOptions.fit !== undefined) entries.push(['fit', transformOptions.fit]);
  if (transformOptions.gravity !== undefined) entries.push(['gravity', transformOptions.gravity]);
  if (transformOptions.background !== undefined)
    entries.push(['background', transformOptions.background]);
  if (transformOptions.quality !== undefined) entries.push(['quality', transformOptions.quality]);
  if (transformOptions.format !== undefined && transformOptions.format !== 'auto') {
    entries.push(['format', transformOptions.format]);
  }
  if (transformOptions.dpr !== undefined) entries.push(['dpr', transformOptions.dpr]);
  if (transformOptions.rotate !== undefined) entries.push(['rotate', transformOptions.rotate]);
  if (transformOptions.sharpen !== undefined) entries.push(['sharpen', transformOptions.sharpen]);
  if (entries.length === 0) return 'public';
  return entries.map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`).join(',');
}

export function normalizeCloudflareVariantName(variantName: TypeImageVariantName | 'custom') {
  if (variantName === 'original') return 'public';
  return variantName;
}

export function signCloudflareImageUrl(url: URL, options: ICloudflareImageUrlOptions) {
  if (!options.signingKey) {
    throw new Error('Cloudflare signingKey is required for signed delivery');
  }
  const expiry = resolveExpiryTimestamp(options);
  url.searchParams.set('exp', String(expiry));
  const stringToSign = `${url.pathname}?${url.searchParams.toString()}`;
  const sig = createHmac('sha256', options.signingKey).update(stringToSign).digest('hex');
  url.searchParams.set('sig', sig);
}

function resolveExpiryTimestamp(options: IImageDeliveryOptions) {
  const expiresIn = options.expiresIn ?? 60 * 10;
  return Math.floor(Date.now() / 1000) + expiresIn;
}
