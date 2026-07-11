import type {
  EntityImage,
  IImageDirectUploadInput,
  IImageProviderDeliveryOptions,
  IImageProviderDirectUploadResource,
  IImageProviderResource,
  IImageUploadInput,
  IImageUploadUrlInput,
} from 'vona-module-a-image';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IImageProviderCloudflareClientOptions } from '../bean/imageProvider.cloudflare.ts';

import {
  buildCloudflareImageUrl,
  resolveCloudflareDeliveryBaseUrl,
  resolveCloudflareDeliveryBaseUrlFromVariantUrl,
} from '../lib/cloudflareImageUrl.ts';

interface ICloudflareApiEnvelope<T> {
  result: T;
  success: boolean;
  errors?: Array<{ message?: string }>;
  messages?: Array<{ message?: string }>;
}

interface ICloudflareImageResult {
  id: string;
  filename?: string;
  uploaded?: string;
  // Cloudflare upstream field; app-level contract should use `public`.
  requireSignedURLs?: boolean;
  variants?: string[];
  metadata?: Record<string, unknown>;
  draft?: boolean;
}

interface ICloudflareImageDetailsResult extends ICloudflareImageResult {
  meta?: {
    filename?: string;
  };
}

interface ICloudflareClientOptionsNormalized extends IImageProviderCloudflareClientOptions {
  accountId: string;
  apiToken: string;
  apiBaseUrl: string;
  deliveryBaseUrl?: string;
}

@Service()
export class ServiceImageCloudflare extends BeanBase {
  async upload(
    input: IImageUploadInput,
    options: IImageProviderCloudflareClientOptions,
  ): Promise<IImageProviderResource> {
    const normalized = this._normalizeClientOptions(options);
    const form = new FormData();
    const buffer = await fse.readFile(input.file);
    const filename = input.filename ?? path.basename(input.file);
    form.append('file', new Blob([buffer], { type: input.contentType }), filename);
    this._appendUploadFields(form, {
      requireSignedURLs: input.public === undefined ? undefined : !input.public,
      metadata: input.meta,
    });
    const result = await this._request<ICloudflareImageResult>(normalized, '/images/v1', {
      method: 'POST',
      body: form,
    });
    const stat = await fse.stat(input.file);
    return this._mapImageResource(result, normalized, {
      filename,
      contentType: input.contentType,
      size: input.size ?? Number(stat.size),
      meta: input.meta,
      public: input.public,
    });
  }

  async uploadUrl(
    input: IImageUploadUrlInput,
    options: IImageProviderCloudflareClientOptions,
  ): Promise<IImageProviderResource> {
    const normalized = this._normalizeClientOptions(options);
    const form = new FormData();
    form.append('url', input.url);
    this._appendUploadFields(form, {
      requireSignedURLs: input.public === undefined ? undefined : !input.public,
      metadata: input.meta,
    });
    const result = await this._request<ICloudflareImageResult>(normalized, '/images/v1', {
      method: 'POST',
      body: form,
    });
    return this._mapImageResource(result, normalized, {
      filename: input.filename ?? result.filename,
      contentType: input.contentType,
      meta: input.meta,
      public: input.public,
    });
  }

  async createDirectUpload(
    input: IImageDirectUploadInput,
    options: IImageProviderCloudflareClientOptions,
  ): Promise<IImageProviderDirectUploadResource> {
    const normalized = this._normalizeClientOptions(options);
    const form = new FormData();
    this._appendUploadFields(form, {
      requireSignedURLs: input.public === undefined ? undefined : !input.public,
      metadata: input.meta,
      expiry: input.expiry,
      id: input.customId,
    });
    const result = await this._request<ICloudflareImageResult & { uploadURL: string }>(
      normalized,
      '/images/v2/direct_upload',
      {
        method: 'POST',
        body: form,
      },
    );
    const resource = this._mapImageResource(result, normalized, {
      filename: input.filename,
      contentType: input.contentType,
      meta: input.meta,
      public: input.public,
    });
    return {
      ...resource,
      uploadUrl: result.uploadURL,
      draft: true,
    };
  }

  async finalizeDirectUpload(
    image: Pick<EntityImage, 'resourceId' | 'filename' | 'meta' | 'public'>,
    options: IImageProviderCloudflareClientOptions,
  ): Promise<IImageProviderResource | undefined> {
    const normalized = this._normalizeClientOptions(options);
    const result = await this._request<ICloudflareImageDetailsResult>(
      normalized,
      `/images/v1/${encodeURIComponent(image.resourceId)}`,
      {
        method: 'GET',
      },
    );
    if (result.draft) return undefined;
    return this._mapImageResource(result, normalized, {
      filename: result.filename ?? result.meta?.filename ?? image.filename,
      meta: image.meta,
      public: image.public,
    });
  }

  async remove(
    image: Pick<EntityImage, 'resourceId'>,
    options: IImageProviderCloudflareClientOptions,
  ) {
    const normalized = this._normalizeClientOptions(options);
    const response = await fetch(
      `${normalized.apiBaseUrl}/accounts/${normalized.accountId}/images/v1/${encodeURIComponent(image.resourceId)}`,
      {
        method: 'DELETE',
        headers: this._createHeaders(normalized),
      },
    );
    if (response.status === 404) return;
    await this._parseEnvelope<unknown>(response);
  }

  buildVariantUrl(
    image: Pick<EntityImage, 'resourceId' | 'deliveryBaseUrl' | 'public'>,
    variantName: string | 'custom',
    transformOptions: Record<string, any>,
    options: IImageProviderCloudflareClientOptions,
    deliveryOptions?: IImageProviderDeliveryOptions,
  ) {
    const normalized = this._normalizeClientOptions(options);
    return buildCloudflareImageUrl(image.resourceId, variantName as any, transformOptions, {
      accountHash: normalized.accountHash,
      deliveryBaseUrl: image.deliveryBaseUrl ?? normalized.deliveryBaseUrl,
      signingKey: normalized.signingKey,
      signed: deliveryOptions?.protected ?? !(image.public ?? normalized.public ?? true),
      expiresIn: deliveryOptions?.expiresIn,
    });
  }

  private _appendUploadFields(
    form: FormData,
    data: {
      requireSignedURLs?: boolean;
      metadata?: Record<string, unknown>;
      expiry?: string | number | Date;
      id?: string;
    },
  ) {
    if (data.requireSignedURLs !== undefined) {
      form.append('requireSignedURLs', String(data.requireSignedURLs));
    }
    if (data.metadata !== undefined) {
      form.append('metadata', JSON.stringify(data.metadata));
    }
    if (data.expiry !== undefined) {
      form.append(
        'expiry',
        data.expiry instanceof Date ? data.expiry.toISOString() : String(data.expiry),
      );
    }
    if (data.id) {
      form.append('id', data.id);
    }
  }

  private _normalizeClientOptions(options: IImageProviderCloudflareClientOptions) {
    const accountId = options.accountId;
    const apiToken = options.apiToken;
    if (!accountId) {
      throw new Error('Cloudflare Images accountId is required');
    }
    if (!apiToken) {
      throw new Error('Cloudflare Images apiToken is required');
    }
    return {
      ...options,
      accountId,
      apiToken,
      apiBaseUrl: (options.apiBaseUrl ?? 'https://api.cloudflare.com/client/v4').replace(/\/$/, ''),
      deliveryBaseUrl: options.deliveryBaseUrl
        ? resolveCloudflareDeliveryBaseUrl(options)
        : undefined,
    };
  }

  private _createHeaders(options: { apiToken: string }) {
    return {
      Authorization: `Bearer ${options.apiToken}`,
    };
  }

  private async _request<T>(
    options: ICloudflareClientOptionsNormalized,
    apiPath: string,
    init: RequestInit,
  ) {
    const response = await fetch(`${options.apiBaseUrl}/accounts/${options.accountId}${apiPath}`, {
      ...init,
      headers: {
        ...this._createHeaders(options),
        ...(init.headers ?? {}),
      },
    });
    return await this._parseEnvelope<T>(response);
  }

  private async _parseEnvelope<T>(response: Response) {
    const data = (await response.json()) as ICloudflareApiEnvelope<T>;
    if (!response.ok || !data.success) {
      const message = data.errors
        ?.map(item => item.message)
        .filter(Boolean)
        .join('; ');
      throw new Error(message || `Cloudflare Images request failed: ${response.status}`);
    }
    return data.result;
  }

  private _mapImageResource(
    result: ICloudflareImageResult,
    options: ICloudflareClientOptionsNormalized,
    data: {
      filename?: string;
      contentType?: string;
      size?: number;
      meta?: Record<string, unknown>;
      public?: boolean;
    },
  ): IImageProviderResource {
    const deliveryBaseUrl =
      options.deliveryBaseUrl ??
      resolveCloudflareDeliveryBaseUrlFromVariantUrl(result.variants?.[0]);
    return {
      resourceId: result.id,
      filename: data.filename ?? result.filename,
      contentType: data.contentType,
      size: data.size,
      public:
        data.public ??
        (result.requireSignedURLs !== undefined ? !result.requireSignedURLs : options.public),
      variants: options.variants,
      meta: data.meta,
      deliveryBaseUrl,
      raw: result,
    };
  }
}
