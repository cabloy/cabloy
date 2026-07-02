import type { IImageDeliveryOptions } from 'vona-module-a-image';

import { createHmac } from 'node:crypto';

export interface IImageNativeSignedUrlOptions extends IImageDeliveryOptions {
  signingKey?: string;
  tokenName?: string;
}

export function buildImageNativeSignedUrl(
  url: string,
  options: IImageNativeSignedUrlOptions,
): string {
  const signingKey = options.signingKey;
  if (!signingKey) {
    throw new Error('Image native signing key is required for signed delivery');
  }
  const tokenName = options.tokenName ?? 'sig';
  const urlCurrent = new URL(url, 'http://localhost');
  const expiry = resolveExpiryTimestamp(options);
  urlCurrent.searchParams.set('exp', String(expiry));
  const stringToSign = `${urlCurrent.pathname}?${urlCurrent.searchParams.toString()}`;
  const sig = createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  urlCurrent.searchParams.set(tokenName, sig);
  return urlCurrent.toString().replace(urlCurrent.origin, '');
}

function resolveExpiryTimestamp(options: IImageDeliveryOptions) {
  if (options.expiresAt !== undefined) {
    const value =
      options.expiresAt instanceof Date
        ? options.expiresAt.getTime()
        : typeof options.expiresAt === 'string'
          ? new Date(options.expiresAt).getTime()
          : Number(options.expiresAt);
    if (!Number.isFinite(value)) {
      throw new TypeError(`Invalid expiresAt for signed delivery: ${String(options.expiresAt)}`);
    }
    return Math.floor(value / 1000);
  }
  const expiresIn = options.expiresIn ?? 60 * 10;
  return Math.floor(Date.now() / 1000) + expiresIn;
}
