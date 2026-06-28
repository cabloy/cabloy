import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityImage } from '../entity/image.ts';
import type {
  IImageProviderResource,
  IImageResource,
  IImageUploadInput,
  IImageUploadOptions,
} from '../types/image.ts';
import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IImageProviderExecute } from '../types/imageProvider.ts';

@Bean()
export class BeanImage extends BeanBase {
  async upload<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageUploadInput,
    options?: IImageUploadOptions,
  ): Promise<IImageResource> {
    const clientName = options?.clientName ?? 'default';
    const { entityImageProvider, disabled, beanFullName, onionOptions, clientOptions } =
      await this.bean.imageProvider.getClientOptions(
        {
          providerName,
          clientName,
        },
        options?.clientOptions as any,
      );
    if (!entityImageProvider || disabled) return this.app.throw(403);
    const beanImageProvider = this.app.bean._getBean<IImageProviderExecute>(beanFullName as any);
    const imageProviderResource = await beanImageProvider.upload(
      { ...input, meta: options?.meta ?? input.meta },
      clientOptions as any,
      onionOptions as any,
    );
    const image = await this.scope.model.image.insert({
      providerName,
      clientName,
      resourceId: imageProviderResource.resourceId,
      filename: imageProviderResource.filename,
      contentType: imageProviderResource.contentType,
      size: imageProviderResource.size,
      width: imageProviderResource.width,
      height: imageProviderResource.height,
      requireSignedURLs: imageProviderResource.requireSignedURLs,
      variants: imageProviderResource.variants,
      meta: imageProviderResource.meta,
      storagePath: imageProviderResource.storagePath,
      deliveryBaseUrl: imageProviderResource.deliveryBaseUrl,
    });
    return this._combineImageResource(image, imageProviderResource);
  }

  async get(imageId: TableIdentity): Promise<IImageResource | undefined> {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) return;
    const imageProviderResource = await this._getImageProviderResource(image);
    return this._combineImageResource(image, imageProviderResource);
  }

  async delete(imageId: TableIdentity) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) return;
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    await beanImageProvider.delete(image, clientOptions as any, onionOptions as any);
    await this.scope.model.image.deleteById(image.id);
  }

  async getVariantUrl(imageId: TableIdentity, variant: string) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    return await beanImageProvider.getVariantUrl(
      image,
      variant,
      clientOptions as any,
      onionOptions as any,
    );
  }

  async download(imageId: TableIdentity) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    if (beanImageProvider.download) {
      return await beanImageProvider.download(image, clientOptions as any, onionOptions as any);
    }
    return {
      kind: 'url' as const,
      url: await beanImageProvider.getVariantUrl(
        image,
        this.scope.config.image.defaultVariant,
        clientOptions as any,
        onionOptions as any,
      ),
      filename: image.filename,
      contentType: image.contentType,
    };
  }

  private async _getImageProviderResource(image: EntityImage) {
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    return await beanImageProvider.get(image, clientOptions as any, onionOptions as any);
  }

  private async _getProviderContext(image: EntityImage) {
    const { beanFullName, onionOptions, clientOptions } =
      await this.bean.imageProvider.getClientOptions({
        providerName: image.providerName,
        clientName: image.clientName,
      });
    const beanImageProvider = this.app.bean._getBean<IImageProviderExecute>(beanFullName as any);
    return { beanImageProvider, onionOptions, clientOptions };
  }

  private _combineImageResource(
    image: EntityImage,
    imageProviderResource?: IImageProviderResource,
  ): IImageResource {
    return {
      id: image.id,
      provider: image.providerName,
      clientName: image.clientName,
      resourceId: imageProviderResource?.resourceId ?? image.resourceId,
      filename: imageProviderResource?.filename ?? image.filename,
      contentType: imageProviderResource?.contentType ?? image.contentType,
      size: imageProviderResource?.size ?? image.size,
      width: imageProviderResource?.width ?? image.width,
      height: imageProviderResource?.height ?? image.height,
      requireSignedURLs: imageProviderResource?.requireSignedURLs ?? image.requireSignedURLs,
      variants: imageProviderResource?.variants ?? image.variants,
      meta: imageProviderResource?.meta ?? image.meta,
      storagePath: imageProviderResource?.storagePath ?? image.storagePath,
      deliveryBaseUrl: imageProviderResource?.deliveryBaseUrl ?? image.deliveryBaseUrl,
      raw: imageProviderResource?.raw,
      uploadedAt: image.createdAt,
    };
  }
}
