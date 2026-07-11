import type { TableIdentity } from 'table-identity';

import type { IFileProviderClientOptions, IFileProviderRecord } from './fileProvider.ts';
import type { IFileSceneRecord } from './fileScene.ts';

export type TypeFileMeta = Record<string, unknown>;
export type TypeFileDirectUploadExpiry = Date | string | number;
export type TypeFileStatus = 'draft' | 'ready' | 'expired';

export interface IFileDeliveryOptions {
  signed?: boolean;
  expiresIn?: number;
  audience?: 'currentUser';
  deliveryKind?: 'auto' | 'proxy' | 'provider';
  responseMode?: 'auto' | 'buffer' | 'url';
}

export interface IFileUploadInput<TMeta extends TypeFileMeta = TypeFileMeta> {
  file: string;
  filename?: string;
  contentType?: string;
  size?: number;
  objectKey?: string;
  public?: boolean;
  meta?: TMeta;
}

export interface IFileUploadUrlInput<TMeta extends TypeFileMeta = TypeFileMeta> {
  url: string;
  policy?: IFileUploadUrlPolicyResolved;
  filename?: string;
  contentType?: string;
  size?: number;
  objectKey?: string;
  public?: boolean;
  meta?: TMeta;
}

export interface IFileDirectUploadInput<TMeta extends TypeFileMeta = TypeFileMeta> {
  filename?: string;
  contentType?: string;
  size?: number;
  objectKey?: string;
  public?: boolean;
  meta?: TMeta;
  expiry?: TypeFileDirectUploadExpiry;
}

export interface IFileUploadContextResolved<TMeta extends TypeFileMeta = TypeFileMeta> {
  fileScene: keyof IFileSceneRecord;
  providerName: keyof IFileProviderRecord;
  clientName: string;
  public: boolean;
  meta?: TMeta;
}

export interface IFileDownloadResult {
  kind: 'url' | 'buffer';
  url?: string;
  buffer?: Buffer;
  filename?: string;
  contentType?: string;
  signed?: boolean;
}

export interface IFileProviderResource<TMeta extends TypeFileMeta = TypeFileMeta, TRaw = unknown> {
  resourceId: string;
  bucket?: string;
  objectKey?: string;
  filename?: string;
  contentType?: string;
  size?: number;
  etag?: string;
  public?: boolean;
  meta?: TMeta;
  storagePath?: string;
  deliveryBaseUrl?: string;
  raw?: TRaw;
}

export interface IFileProviderDirectUploadResource<
  TMeta extends TypeFileMeta = TypeFileMeta,
  TRaw = unknown,
> extends IFileProviderResource<TMeta, TRaw> {
  uploadUrl: string;
  headers?: Record<string, string>;
  method?: 'PUT' | 'POST';
}

export interface IFileResource<
  TMeta extends TypeFileMeta = TypeFileMeta,
  TRaw = unknown,
> extends IFileProviderResource<TMeta, TRaw> {
  id: TableIdentity;
  provider: keyof IFileProviderRecord;
  clientName: string;
  fileScene?: keyof IFileSceneRecord | string;
  status?: TypeFileStatus;
  draftExpiresAt?: Date;
  finalizedAt?: Date;
  uploadedAt?: Date;
}

export interface IFileDirectUploadResult<
  TMeta extends TypeFileMeta = TypeFileMeta,
  TRaw = unknown,
> extends IFileResource<TMeta, TRaw> {
  uploadUrl: string;
  headers?: Record<string, string>;
  method?: 'PUT' | 'POST';
}

export interface IFileActionResponse {
  id: TableIdentity;
  filename?: string;
  contentType?: string;
  size?: number;
  public?: boolean;
  uploadedAt?: Date;
  url: string;
  signed: boolean;
}

export interface IFileDirectUploadResponse {
  id: TableIdentity;
  uploadUrl: string;
  headers?: Record<string, string>;
  method?: 'PUT' | 'POST';
  filename?: string;
  public?: boolean;
}

export interface IFileView {
  id: TableIdentity;
  filename?: string;
  contentType?: string;
  size?: number;
  public?: boolean;
  uploadedAt?: Date;
  downloadUrl: string;
  signed?: boolean;
}

export interface IFileUploadOptions<
  TClientOptions extends IFileProviderClientOptions = IFileProviderClientOptions,
  TMeta extends TypeFileMeta = TypeFileMeta,
> {
  clientName?: string;
  clientOptions?: TClientOptions;
  public?: boolean;
  meta?: TMeta;
  fileScene?: keyof IFileSceneRecord;
}

export interface IFileUploadUrlPolicyResolved<
  TMeta extends TypeFileMeta = TypeFileMeta,
> extends IFileUploadContextResolved<TMeta> {
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
}

export interface IFileUploadPolicyResolved<
  TMeta extends TypeFileMeta = TypeFileMeta,
> extends IFileUploadUrlPolicyResolved<TMeta> {
  fileSize: number;
  mimeType: string;
}

export interface IFileDownloadTokenPayload {
  kind: 'fileDownload';
  fileId: TableIdentity;
  audienceUserId?: TableIdentity;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    file: never;
  }
}
