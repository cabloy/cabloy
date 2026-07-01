import type { TableIdentity } from 'table-identity';

import type { IImageProviderClientOptions, IImageProviderRecord } from './imageProvider.ts';
import type { IImageSceneRecord } from './imageScene.ts';

export interface IImageTransformOptions {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  background?: string;
  quality?: number;
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';
  dpr?: number;
  rotate?: number;
  sharpen?: number;
}

export type IImageNamedVariants = Record<string, IImageTransformOptions>;

export interface IImageVariantRequest {
  variantName?: string;
  transformOptions?: IImageTransformOptions;
}

export type TypeImageVariantInput = string | IImageVariantRequest | undefined;

export type TypeImageMeta = Record<string, unknown>;

export interface IImageUploadInput<TMeta extends TypeImageMeta = TypeImageMeta> {
  file: string;
  filename?: string;
  contentType?: string;
  size?: number;
  meta?: TMeta;
}

export interface IImageDownloadResult {
  kind: 'url' | 'buffer';
  url?: string;
  buffer?: Buffer;
  filename?: string;
  contentType?: string;
}

export interface IImageProviderResource<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> {
  resourceId: string;
  filename?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  requireSignedURLs?: boolean;
  variants?: IImageNamedVariants;
  meta?: TMeta;
  storagePath?: string;
  deliveryBaseUrl?: string;
  raw?: TRaw;
}

export interface IImageResource<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> extends IImageProviderResource<TMeta, TRaw> {
  id: TableIdentity;
  provider: keyof IImageProviderRecord;
  clientName: string;
  imageScene?: keyof IImageSceneRecord | string;
  uploadedAt?: Date;
}

export interface IImageView {
  id: TableIdentity;
  url: string;
  filename?: string;
  width?: number;
  height?: number;
  provider: keyof IImageProviderRecord;
  clientName: string;
  imageScene?: keyof IImageSceneRecord | string;
  uploadedAt?: Date;
  variants?: IImageNamedVariants;
}

export interface IImageUploadOptions<
  TClientOptions extends IImageProviderClientOptions = IImageProviderClientOptions,
  TMeta extends TypeImageMeta = TypeImageMeta,
> {
  clientName?: string;
  clientOptions?: TClientOptions;
  meta?: TMeta;
  imageScene?: keyof IImageSceneRecord | string;
}

export interface IImageUploadPolicyResolved<TMeta extends TypeImageMeta = TypeImageMeta> {
  imageScene: keyof IImageSceneRecord | string;
  providerName: keyof IImageProviderRecord;
  clientName: string;
  meta?: TMeta;
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
  fileSize: number;
  mimeType: string;
}

export interface IImageUploadTokenPayload<
  TMeta extends TypeImageMeta = TypeImageMeta,
> extends IImageUploadPolicyResolved<TMeta> {
  kind: 'imageUpload';
  expiresIn: number;
  issuedAt: number;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    image: never;
  }
}
