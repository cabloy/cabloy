import type {
  EntityFile,
  IFileDeliveryOptions,
  IFileDirectUploadInput,
  IFileProviderDirectUploadResource,
  IFileProviderResource,
  IFileUploadInput,
  IFileUploadUrlInput,
} from 'vona-module-a-file';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IFileProviderCloudflareClientOptions } from '../bean/fileProvider.cloudflare.ts';

interface IFileCloudflareClientOptionsNormalized extends IFileProviderCloudflareClientOptions {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

@Service()
export class ServiceFileCloudflare extends BeanBase {
  async upload(
    input: IFileUploadInput,
    options: IFileProviderCloudflareClientOptions,
  ): Promise<IFileProviderResource> {
    const normalized = this._normalizeClientOptions(options);
    const objectKey = input.objectKey ?? this._createObjectKey(input.filename);
    const body = await fse.readFile(input.file);
    const command = new PutObjectCommand({
      Bucket: normalized.bucket,
      Key: objectKey,
      Body: body,
      ContentType: input.contentType,
    });
    const result = await this._getClient(normalized).send(command);
    const stat = await fse.stat(input.file);
    return {
      resourceId: uuidv4(),
      bucket: normalized.bucket,
      objectKey,
      filename: input.filename ?? path.basename(objectKey),
      contentType: input.contentType,
      size: input.size ?? Number(stat.size),
      etag: this._normalizeEtag(result.ETag),
      deliveryBaseUrl: normalized.deliveryBaseUrl,
      public: input.public ?? normalized.public,
      meta: input.meta,
      raw: result,
    };
  }

  async uploadUrl(
    input: IFileUploadUrlInput,
    options: IFileProviderCloudflareClientOptions,
  ): Promise<IFileProviderResource> {
    const response = await fetch(input.url);
    if (!response.ok) {
      throw new Error(`Remote file fetch failed: ${response.status}`);
    }
    const tempDir = await this.app.util.getPublicPathPhysical('.temp-file-cloudflare', true);
    const tempFile = path.join(
      tempDir,
      `${uuidv4()}${path.extname(input.filename ?? new URL(input.url).pathname)}`,
    );
    const arrayBuffer = await response.arrayBuffer();
    await fse.writeFile(tempFile, Buffer.from(arrayBuffer));
    try {
      return await this.upload(
        {
          file: tempFile,
          filename: input.filename ?? path.basename(new URL(input.url).pathname),
          contentType: input.contentType ?? response.headers.get('content-type') ?? undefined,
          size: input.size,
          objectKey: input.objectKey,
          public: input.public,
          meta: input.meta,
        },
        options,
      );
    } finally {
      await fse.remove(tempFile);
    }
  }

  async createDirectUpload(
    input: IFileDirectUploadInput,
    options: IFileProviderCloudflareClientOptions,
  ): Promise<IFileProviderDirectUploadResource> {
    const normalized = this._normalizeClientOptions(options);
    const objectKey = input.objectKey ?? this._createObjectKey(input.filename);
    const command = new PutObjectCommand({
      Bucket: normalized.bucket,
      Key: objectKey,
      ContentType: input.contentType,
    });
    const uploadUrl = await getSignedUrl(this._getClient(normalized), command, {
      expiresIn: this._resolveExpiresIn(input.expiry, normalized.presignExpiresIn ?? 600),
    });
    return {
      resourceId: uuidv4(),
      bucket: normalized.bucket,
      objectKey,
      filename: input.filename ?? path.basename(objectKey),
      contentType: input.contentType,
      size: input.size,
      deliveryBaseUrl: normalized.deliveryBaseUrl,
      public: input.public ?? normalized.public,
      meta: input.meta,
      uploadUrl,
      method: 'PUT',
      headers: input.contentType ? { 'content-type': input.contentType } : undefined,
      draft: true,
    };
  }

  async remove(
    file: Pick<EntityFile, 'bucket' | 'objectKey'>,
    options: IFileProviderCloudflareClientOptions,
  ) {
    const normalized = this._normalizeClientOptions(options);
    if (!file.objectKey) return;
    await this._getClient(normalized).send(
      new DeleteObjectCommand({
        Bucket: file.bucket ?? normalized.bucket,
        Key: file.objectKey,
      }),
    );
  }

  async getDownloadUrl(
    file: Pick<EntityFile, 'bucket' | 'objectKey' | 'deliveryBaseUrl' | 'public'>,
    options: IFileProviderCloudflareClientOptions,
    deliveryOptions?: IFileDeliveryOptions,
  ) {
    const normalized = this._normalizeClientOptions(options);
    const bucket = file.bucket ?? normalized.bucket;
    const objectKey = file.objectKey;
    if (!objectKey) {
      throw new Error('File objectKey is required');
    }
    const isPublic = file.public ?? normalized.public;
    const deliveryBaseUrl = file.deliveryBaseUrl ?? normalized.deliveryBaseUrl;
    if (isPublic && deliveryBaseUrl) {
      return this._buildPublicUrl(deliveryBaseUrl, objectKey);
    }
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });
    return await getSignedUrl(this._getClient(normalized), command, {
      expiresIn: deliveryOptions?.expiresIn ?? normalized.presignExpiresIn ?? 600,
    });
  }

  async getMetadata(
    file: Pick<EntityFile, 'bucket' | 'objectKey'>,
    options: IFileProviderCloudflareClientOptions,
  ) {
    const normalized = this._normalizeClientOptions(options);
    if (!file.objectKey) return undefined;
    return await this._getClient(normalized).send(
      new HeadObjectCommand({
        Bucket: file.bucket ?? normalized.bucket,
        Key: file.objectKey,
      }),
    );
  }

  private _normalizeClientOptions(options: IFileProviderCloudflareClientOptions) {
    const endpoint = options.endpoint;
    const accessKeyId = options.accessKeyId;
    const secretAccessKey = options.secretAccessKey;
    const bucket = options.bucket;
    if (!endpoint) throw new Error('Cloudflare R2 endpoint is required');
    if (!accessKeyId) throw new Error('Cloudflare R2 accessKeyId is required');
    if (!secretAccessKey) throw new Error('Cloudflare R2 secretAccessKey is required');
    if (!bucket) throw new Error('Cloudflare R2 bucket is required');
    return {
      ...options,
      endpoint: endpoint.replace(/\/$/, ''),
      region: options.region ?? 'auto',
      accessKeyId,
      secretAccessKey,
      bucket,
    } as IFileCloudflareClientOptionsNormalized;
  }

  private _getClient(options: IFileCloudflareClientOptionsNormalized) {
    return new S3Client({
      region: options.region,
      endpoint: options.endpoint,
      forcePathStyle: options.forcePathStyle ?? true,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  private _createObjectKey(filename?: string) {
    const ext = path.extname(filename ?? '') || '.bin';
    return `${uuidv4()}${ext}`;
  }

  private _normalizeEtag(etag?: string) {
    return etag?.replace(/^"|"$/g, '');
  }

  private _resolveExpiresIn(expiry: IFileDirectUploadInput['expiry'], fallback: number) {
    if (expiry === undefined) return fallback;
    const expiresAt =
      expiry instanceof Date
        ? expiry.getTime()
        : typeof expiry === 'string'
          ? new Date(expiry).getTime()
          : Number(expiry);
    if (!Number.isFinite(expiresAt)) {
      throw new TypeError(`Invalid direct upload expiry: ${String(expiry)}`);
    }
    const expiresIn = Math.max(1, Math.floor((expiresAt - Date.now()) / 1000));
    return expiresIn;
  }

  private _buildPublicUrl(deliveryBaseUrl: string, objectKey: string) {
    const base = deliveryBaseUrl.replace(/\/$/, '');
    const key = objectKey
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
    return `${base}/${key}`;
  }
}
