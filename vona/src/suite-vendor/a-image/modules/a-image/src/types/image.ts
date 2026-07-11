import type { TableIdentity } from 'table-identity';

import type { IImageProviderClientOptions, IImageProviderRecord } from './imageProvider.ts';
import type { IImageSceneRecord } from './imageScene.ts';

// Extend this record via declaration merging to register project-specific named variants.
// Example:
// declare module 'vona-module-a-image' {
//   interface IImageVariantNameRecord {
//     hero: never;
//   }
// }
export interface IImageVariantNameRecord {
  original: never;
  thumbnail: never;
  small: never;
  medium: never;
  large: never;
  cover: never;
  avatar: never;
}

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

export type TypeImageVariantName = keyof IImageVariantNameRecord;

export type IImageNamedVariants = Partial<Record<TypeImageVariantName, IImageTransformOptions>>;

export type TypeImageDirectUploadExpiry = Date | string | number;

export type TypeImageStatus = 'draft' | 'ready' | 'expired';

export interface IImageDeliveryOptions {
  expiresIn?: number;
  audience?: boolean;
  responseMode?: 'auto' | 'buffer' | 'url';
}

export interface IImageProviderDeliveryOptions {
  protected: boolean;
  expiresIn?: number;
  responseMode?: 'auto' | 'buffer' | 'url';
}

export interface IImageVariantRequestBase extends IImageDeliveryOptions {}

// Request a declaration-merged named variant such as `thumbnail` or a project-specific key.
export interface IImageVariantRequestByName extends IImageVariantRequestBase {
  variantName?: TypeImageVariantName;
  transformOptions?: never;
}

// Request an ad hoc image transform without registering a named variant.
export interface IImageVariantRequestByTransform extends IImageVariantRequestBase {
  variantName?: never;
  transformOptions?: IImageTransformOptions;
}

export type IImageVariantRequest = IImageVariantRequestByName | IImageVariantRequestByTransform;

export type TypeImageVariantInput = TypeImageVariantName | IImageVariantRequest | undefined;

export type TypeImageMeta = Record<string, unknown>;

export interface IImageUploadInput<TMeta extends TypeImageMeta = TypeImageMeta> {
  file: string;
  filename?: string;
  contentType?: string;
  size?: number;
  public?: boolean;
  meta?: TMeta;
}

export interface IImageUploadUrlInput<TMeta extends TypeImageMeta = TypeImageMeta> {
  url: string;
  filename?: string;
  contentType?: string;
  public?: boolean;
  meta?: TMeta;
}

export interface IImageDirectUploadInput<TMeta extends TypeImageMeta = TypeImageMeta> {
  filename?: string;
  contentType?: string;
  public?: boolean;
  meta?: TMeta;
  expiry?: TypeImageDirectUploadExpiry;
  customId?: string;
}

export interface IImageUploadContextResolved<TMeta extends TypeImageMeta = TypeImageMeta> {
  imageScene: keyof IImageSceneRecord;
  providerName: keyof IImageProviderRecord;
  clientName: string;
  public?: boolean;
  meta?: TMeta;
}

export interface IImageDownloadResult {
  kind: 'url' | 'buffer';
  url?: string;
  buffer?: Buffer;
  filename?: string;
  contentType?: string;
  signed?: boolean;
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
  public?: boolean;
  variants?: IImageNamedVariants;
  meta?: TMeta;
  storagePath?: string;
  deliveryBaseUrl?: string;
  raw?: TRaw;
}

export interface IImageProviderDirectUploadResource<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> extends IImageProviderResource<TMeta, TRaw> {
  uploadUrl: string;
  draft?: boolean;
}

export interface IImageResource<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> extends IImageProviderResource<TMeta, TRaw> {
  id: TableIdentity;
  provider: keyof IImageProviderRecord;
  clientName: string;
  imageScene?: keyof IImageSceneRecord | string;
  status?: TypeImageStatus;
  draftExpiresAt?: Date;
  finalizedAt?: Date;
  uploadedAt?: Date;
}

export interface IImageDirectUploadResult<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> extends IImageResource<TMeta, TRaw> {
  uploadUrl: string;
  draft?: boolean;
}

export interface IImageFinalizeDirectUploadResult<
  TMeta extends TypeImageMeta = TypeImageMeta,
  TRaw = unknown,
> extends IImageResource<TMeta, TRaw> {}

export interface IImageActionResponse {
  id: TableIdentity;
  filename?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  public?: boolean;
  url: string;
  signed: boolean;
}

export interface IImageDirectUploadResponse {
  id: TableIdentity;
  uploadUrl: string;
  filename?: string;
  public?: boolean;
}

export interface IImageView {
  id: TableIdentity;
  url: string;
  filename?: string;
  width?: number;
  height?: number;
  public?: boolean;
  signed: boolean;
}

export interface IImageUploadOptions<
  TClientOptions extends IImageProviderClientOptions = IImageProviderClientOptions,
  TMeta extends TypeImageMeta = TypeImageMeta,
> {
  clientName?: string;
  clientOptions?: TClientOptions;
  meta?: TMeta;
  imageScene?: keyof IImageSceneRecord;
}

export interface IImageUploadPolicyResolved<
  TMeta extends TypeImageMeta = TypeImageMeta,
> extends IImageUploadContextResolved<TMeta> {
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
  fileSize: number;
  mimeType: string;
}

export interface IImageDeliveryTokenPayload {
  kind: 'imageDelivery';
  imageId: TableIdentity;
  request: IImageVariantRequest;
  audienceUserId?: TableIdentity;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    image: never;
  }
}
