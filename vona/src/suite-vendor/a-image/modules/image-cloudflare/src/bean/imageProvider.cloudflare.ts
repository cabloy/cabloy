import type {
  IDecoratorImageProviderOptions,
  IImageDownloadResult,
  IImageProviderExecute,
  IImageProviderResource,
  IImageUploadInput,
} from 'vona-module-a-image';
import type { EntityImage } from 'vona-module-a-image';

import { BeanBase } from 'vona';
import { ImageProvider } from 'vona-module-a-image';

export interface IImageProviderCloudflareClientRecord {
  default: never;
  cloud: never;
}

export interface IImageProviderCloudflareClientOptions {
  accountId?: string;
  apiToken?: string;
  deliveryBaseUrl?: string;
  variants?: Record<string, string>;
  requireSignedURLs?: boolean;
}

export interface IImageProviderOptionsCloudflare extends IDecoratorImageProviderOptions<
  IImageProviderCloudflareClientRecord,
  IImageProviderCloudflareClientOptions
> {}

@ImageProvider<IImageProviderOptionsCloudflare>({
  base: {
    variants: {
      original: 'original',
    },
  },
})
export class ImageProviderCloudflare
  extends BeanBase
  implements
    IImageProviderExecute<IImageProviderCloudflareClientOptions, IImageProviderOptionsCloudflare>
{
  async upload(
    input: IImageUploadInput,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ): Promise<IImageProviderResource> {
    const resourceId = `cloudflare:${input.filename ?? 'image'}`;
    const variants = Object.entries(clientOptions.variants ?? { original: 'original' }).map(
      ([name, value]) => this._buildVariantUrl(resourceId, name, value, clientOptions),
    );
    return {
      resourceId,
      filename: input.filename,
      contentType: input.contentType,
      size: input.size,
      requireSignedURLs: clientOptions.requireSignedURLs,
      deliveryBaseUrl: clientOptions.deliveryBaseUrl,
      variants,
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
    variant: string,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    const variants = clientOptions.variants ?? { original: 'original' };
    return this._buildVariantUrl(image.resourceId, variant, variants[variant] ?? variant, {
      ...clientOptions,
      deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    });
  }

  async download(
    image: EntityImage,
    clientOptions: IImageProviderCloudflareClientOptions,
    options: IImageProviderOptionsCloudflare,
  ): Promise<IImageDownloadResult> {
    return {
      kind: 'url',
      url: await this.getVariantUrl(image, 'original', clientOptions, options),
      filename: image.filename,
      contentType: image.contentType,
    };
  }

  private _buildVariantUrl(
    resourceId: string,
    variantName: string,
    variantValue: string,
    clientOptions: IImageProviderCloudflareClientOptions,
  ) {
    const base = clientOptions.deliveryBaseUrl ?? 'https://imagedelivery.net/example';
    return `${base.replace(/\/$/, '')}/${resourceId}/${variantValue || variantName}`;
  }
}
