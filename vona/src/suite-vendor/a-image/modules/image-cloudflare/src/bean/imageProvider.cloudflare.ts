import type {
  IDecoratorImageProviderOptions,
  IImageDirectUploadInput,
  IImageProviderDeliveryOptions,
  IImageDownloadResult,
  IImageProviderClientOptions,
  IImageProviderClientRecord,
  IImageProviderExecute,
  IImageProviderResource,
  IImageUploadInput,
  IImageUploadUrlInput,
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
  accountHash?: string;
  apiBaseUrl?: string;
  signingKey?: string;
  flexibleVariants?: boolean;
  customDomain?: string;
}

export interface IImageProviderOptionsCloudflare extends IDecoratorImageProviderOptions<
  IImageProviderCloudflareClientRecord,
  IImageProviderCloudflareClientOptions
> {}

@ImageProvider<IImageProviderOptionsCloudflare>({
  base: {
    public: true,
    signedDeliveryKind: 'provider',
    variants: {
      original: {},
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
    return await this.scope.service.imageCloudflare.upload(input, clientOptions);
  }

  async uploadUrl(
    input: IImageUploadUrlInput,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    return await this.scope.service.imageCloudflare.uploadUrl(input, clientOptions);
  }

  async createDirectUpload(
    input: IImageDirectUploadInput,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    return await this.scope.service.imageCloudflare.createDirectUpload(input, clientOptions);
  }

  async finalizeDirectUpload(
    image: EntityImage,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    return await this.scope.service.imageCloudflare.finalizeDirectUpload(image, clientOptions);
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
      public: image.public ?? clientOptions.public,
      variants: image.variants ?? clientOptions.variants,
      meta: image.meta,
      deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    };
  }

  async delete(
    image: EntityImage,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
  ) {
    await this.scope.service.imageCloudflare.remove(image, clientOptions);
  }

  async getVariantUrl(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderCloudflareClientOptions,
    _options: IImageProviderOptionsCloudflare,
    deliveryOptions?: IImageProviderDeliveryOptions,
  ) {
    const variants = image.variants ?? clientOptions.variants;
    const resolved = resolveImageVariantRequestToTransform(request, 'original', variants);
    return this._buildVariantUrl(
      image,
      resolved.variantName,
      resolved.transformOptions,
      {
        ...clientOptions,
        deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
        public: image.public ?? clientOptions.public,
      },
      deliveryOptions,
    );
  }

  async download(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderCloudflareClientOptions,
    options: IImageProviderOptionsCloudflare,
    deliveryOptions?: IImageProviderDeliveryOptions,
  ): Promise<IImageDownloadResult> {
    return {
      kind: 'url',
      url: await this.getVariantUrl(image, request, clientOptions, options, deliveryOptions),
      filename: image.filename,
      contentType: image.contentType,
      signed: !!deliveryOptions?.protected,
    };
  }

  private _buildVariantUrl(
    image: EntityImage,
    variantName: TypeImageProviderResolvedVariantName,
    transformOptions: Record<string, any>,
    clientOptions: IImageProviderCloudflareClientOptions,
    deliveryOptions?: IImageProviderDeliveryOptions,
  ) {
    return this.scope.service.imageCloudflare.buildVariantUrl(
      image,
      variantName,
      transformOptions,
      clientOptions,
      deliveryOptions,
    );
  }
}
