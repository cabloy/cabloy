import type {
  IDecoratorImageProviderOptions,
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
}

export interface IImageProviderOptionsNative extends IDecoratorImageProviderOptions<
  IImageProviderNativeClientRecord,
  IImageProviderNativeClientOptions
> {}

@ImageProvider<IImageProviderOptionsNative>({
  base: {
    subdir: 'default',
  },
})
export class ImageProviderNative extends BeanBase implements IImageProviderExecute {
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
      requireSignedURLs: image.requireSignedURLs,
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
  ) {
    return await this.scope.service.imageNative.getVariantUrl(image, request, {
      ...clientOptions,
      subdir: clientOptions.subdir ?? 'default',
      deliveryBaseUrl: image.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    });
  }

  async download(
    image: EntityImage,
    request: IImageVariantRequest,
    clientOptions: IImageProviderNativeClientOptions,
    options: IImageProviderOptionsNative,
  ): Promise<IImageDownloadResult> {
    if (request.variantName === 'original' && !request.transformOptions) {
      const buffer = image.storagePath ? await fse.readFile(image.storagePath) : undefined;
      if (buffer) {
        return {
          kind: 'buffer',
          buffer,
          filename: image.filename,
          contentType: image.contentType,
        };
      }
    }
    return {
      kind: 'url',
      url: await this.getVariantUrl(image, request, clientOptions, options),
      filename: image.filename,
      contentType: image.contentType,
    };
  }
}
