import type { TableIdentity } from 'table-identity';

import type { IImageProviderRecord } from './imageProvider.ts';

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

export interface IImageUploadInput {
  file: string;
  filename?: string;
  contentType?: string;
  size?: number;
  meta?: Record<string, any>;
}

export interface IImageDownloadResult {
  kind: 'url' | 'buffer';
  url?: string;
  buffer?: Buffer;
  filename?: string;
  contentType?: string;
}

export interface IImageProviderResource {
  resourceId: string;
  filename?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  requireSignedURLs?: boolean;
  variants?: IImageNamedVariants;
  meta?: Record<string, any>;
  storagePath?: string;
  deliveryBaseUrl?: string;
  raw?: any;
}

export interface IImageResource extends IImageProviderResource {
  id: TableIdentity;
  provider: keyof IImageProviderRecord;
  clientName: string;
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
  uploadedAt?: Date;
  variants?: IImageNamedVariants;
}

export interface IImageUploadOptions {
  clientName?: string;
  clientOptions?: object;
  meta?: Record<string, any>;
}

export type TypeImageUploadFormScene = 'create' | 'edit';

export interface IImageUploadPolicyResolved {
  resource: string;
  field: string;
  formScene: TypeImageUploadFormScene;
  providerName: keyof IImageProviderRecord;
  clientName: string;
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
  fileSize: number;
  mimeType: string;
}

export interface IImageUploadTokenPayload extends IImageUploadPolicyResolved {
  kind: 'imageUpload';
  expiresIn: number;
  issuedAt: number;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    image: never;
  }
}
