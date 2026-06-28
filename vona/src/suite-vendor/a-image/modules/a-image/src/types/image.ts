import type { TableIdentity } from 'table-identity';

import type { IImageProviderRecord } from './imageProvider.ts';

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
  variants?: string[];
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

export interface IImageUploadOptions {
  clientName?: string;
  clientOptions?: object;
  meta?: Record<string, any>;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    image: never;
  }
}
