import type {
  IDecoratorImageProviderOptions,
  IImageDownloadResult,
  IImageProviderClientOptions,
  IImageProviderClientRecord,
  IImageProviderExecute,
  IImageProviderResource,
  IImageUploadInput,
  IImageVariantRequest,
  TypeImageProviderResolvedVariantName,
} from 'vona-module-a-image';
import type { EntityImage } from 'vona-module-a-image';

import { BeanBase } from 'vona';
import { resolveImageVariantRequestToTransform } from 'vona-module-a-image';
import { ImageProvider } from 'vona-module-a-image';

export interface IImageProviderCloudflareClientRecord extends IImageProviderClientRecord {}

export interface IImageProviderCloudflareClientOptions extends IImageProviderClientOptions {
  accountId?: string;
  apiToken?: string;
}

export interface IImageProviderOptionsCloudflare extends IDecoratorImageProviderOptions<
  IImageProviderCloudflareClientRecord,
  IImageProviderCloudflareClientOptions
> {}

@ImageProvider<IImageProviderOptionsCloudflare>({
  base: {
    variants: {
      original: {},
    },
  },
})
export class ImageProviderCloudflare extends BeanBase implements IImageProviderExecute {
  async upload(
    input: IImageUploadInput,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ): Promise<IImageProviderResource> {
    const resourceId = `cloudflare:${input.filename ?? 'image'}`;
    return {
      resourceId,
      filename: input.filename,
      contentType: input.contentType,
      size: input.size,
      requireSignedURLs: clientOptions.requireSignedURLs,
      deliveryBaseUrl: clientOptions.deliveryBaseUrl,
      variants: clientOptions.variants,
      meta: input.meta,
      raw: {
        provider: 'cloudflare',
        resourceId,
      },
    };
  }

  async get(
    image: EntityImage,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    return {
      resourceId: image.resourceId,
      filename: image.filename,
      contentType: image.contentType,
      size: image.size,
      width: image.width,
      height: image.height,
      requireSignedURLs: image.requireSignedURLs ?? clientOptions.requireSignedURLs,
      variants: image.variants,
      meta: image.meta,
      deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    };
  }

  async delete(
    _image: EntityImage,
    _clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {}

  async getVariantUrl(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    const variants = image.variants ?? clientOptions.variants;
    const resolved = resolveImageVariantRequestToTransform(request, 'original', variants);
    return this._buildVariantUrl(
      image.resourceId,
      resolved.variantName,
      resolved.transformOptions,
      {
        ...clientOptions,
        deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
      },
    );
  }

  async download(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderCloudflareClientOptions,
    options: IImageProviderOptionsCloudflare,
  ): Promise<IImageDownloadResult> {
    return {
      kind: 'url',
      url: await this.getVariantUrl(image, request, clientOptions, options),
      filename: image.filename,
      contentType: image.contentType,
    };
  }

  private _buildVariantUrl(
    resourceId: string,
    variantName: TypeImageProviderResolvedVariantName,
    transformOptions: Record<string, any>,
    clientOptions: IImageProviderCloudflareClientOptions,
  ) {
    const base = clientOptions.deliveryBaseUrl ?? 'https://imagedelivery.net/example';
    if (variantName !== 'custom') {
      return `${base.replace(/\/$/, '')}/${resourceId}/${variantName}`;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(transformOptions)) {
      if (value === undefined || value === null) continue;
      params.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
    const query = params.toString();
    return query
      ? `${base.replace(/\/$/, '')}/${resourceId}?${query}`
      : `${base.replace(/\/$/, '')}/${resourceId}`;
  }
}
