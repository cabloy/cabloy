import type {
  IDecoratorImageProviderOptions,
  IImageDeliveryOptions,
  IImageDirectUploadInput,
  IImageDownloadResult,
  IImageProviderClientOptions,
  IImageProviderClientRecord,
  IImageProviderExecute,
  IImageProviderResource,
  IImageUploadInput,
  IImageVariantRequest,
} from 'vona-module-a-image';
import type { EntityImage } from 'vona-module-a-image';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { ImageProvider } from 'vona-module-a-image';

export interface IImageProviderNativeClientRecord extends IImageProviderClientRecord {}

export interface IImageProviderNativeClientOptions extends IImageProviderClientOptions {
  subdir?: string;
  signingKey?: string;
  tokenName?: string;
}

export interface IImageProviderOptionsNative extends IDecoratorImageProviderOptions<
  IImageProviderNativeClientRecord,
  IImageProviderNativeClientOptions
> {}

@ImageProvider<IImageProviderOptionsNative>({
  base: {
    subdir: 'default',
    public: true,
    signedDeliveryKind: 'proxy',
  },
})
export class ImageProviderNative
  extends BeanBase
  implements IImageProviderExecute<IImageProviderNativeClientOptions, IImageProviderOptionsNative>
{
  async upload(
    input: IImageUploadInput,
    clientOptions: IImageProviderNativeClientOptions,
    _options: IImageProviderOptionsNative,
  ): Promise<IImageProviderResource> {
    const resource = await this.scope.service.imageNative.upload(input, clientOptions);
    return {
      ...resource,
      filename: input.filename,
      contentType: input.contentType,
      meta: input.meta,
    };
  }

  async createDirectUpload(
    input: IImageDirectUploadInput,
    clientOptions: IImageProviderNativeClientOptions,
    _options: IImageProviderOptionsNative,
  ) {
    return await this.scope.service.imageNative.createDirectUpload(input, clientOptions);
  }

  async finalizeDirectUpload(
    image: EntityImage,
    clientOptions: IImageProviderNativeClientOptions,
    _options: IImageProviderOptionsNative,
  ) {
    return await this.scope.service.imageNative.finalizeDirectUpload(image, clientOptions);
  }

  async get(
    image: EntityImage,
    clientOptions: IImageProviderNativeClientOptions,
    _options: IImageProviderOptionsNative,
  ) {
    return {
      resourceId: image.resourceId,
      filename: image.filename,
      contentType: image.contentType,
      size: image.size,
      width: image.width,
      height: image.height,
      public: image.public ?? clientOptions.public,
      variants: image.variants,
      meta: image.meta,
      storagePath: image.storagePath,
      deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    };
  }

  async delete(
    image: EntityImage,
    _clientOptions: IImageProviderClientOptions,
    _options: IImageProviderOptionsNative,
  ) {
    await this.scope.service.imageNative.remove(image);
  }

  async getVariantUrl(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderNativeClientOptions,
    _options: IImageProviderOptionsNative,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    return await this.scope.service.imageNative.getVariantUrl(
      image,
      request,
      {
        ...clientOptions,
        subdir: clientOptions.subdir ?? 'default',
        deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
      },
      deliveryOptions,
    );
  }

  async download(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderNativeClientOptions,
    options: IImageProviderOptionsNative,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageDownloadResult> {
    if (
      (deliveryOptions?.responseMode ?? 'auto') !== 'url' &&
      !deliveryOptions?.signed &&
      request.variantName === 'original' &&
      !request.transformOptions
    ) {
      const buffer = image.storagePath ? await fse.readFile(image.storagePath) : undefined;
      if (buffer) {
        return {
          kind: 'buffer',
          buffer,
          filename: image.filename,
          contentType: image.contentType,
          signed: false,
        };
      }
    }
    return {
      kind: 'url',
      url: await this.getVariantUrl(image, request, clientOptions, options, deliveryOptions),
      filename: image.filename,
      contentType: image.contentType,
      signed: !!deliveryOptions?.signed,
    };
  }
}
