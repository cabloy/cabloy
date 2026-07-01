import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityImage } from '../entity/image.ts';
import type {
  IImageProviderResource,
  IImageResource,
  IImageUploadInput,
  IImageUploadOptions,
  IImageVariantRequest,
  IImageView,
  TypeImageVariantInput,
} from '../types/image.ts';
import type {
  IDecoratorImageProviderOptions,
  IImageProviderClientOptions,
  IImageProviderExecute,
  IImageProviderRecord,
} from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

import { resolveImageVariantRequest } from '../lib/imageVariant.ts';

interface IImageProviderContext {
  beanImageProvider: IImageProviderExecute;
  clientOptions: IImageProviderClientOptions;
  onionOptions: IDecoratorImageProviderOptions;
}

@Bean()
export class BeanImage extends BeanBase {
  async upload<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageUploadInput,
    options?: IImageUploadOptions,
  ): Promise<IImageResource> {
    const clientName = options?.clientName ?? 'default';
    const providerContext = await this.bean.imageProvider.getClientOptions(
      {
        providerName,
        clientName,
      },
      options?.clientOptions,
    );
    if (!providerContext.entityImageProvider || providerContext.disabled) {
      return this.app.throw(403);
    }
    const beanImageProvider = this._getBeanImageProvider(
      providerContext.beanFullName as keyof IImageProviderRecord,
    );
    const clientOptions = this._normalizeClientOptions(providerContext.clientOptions);
    const onionOptions = this._normalizeOnionOptions(providerContext.onionOptions);
    const imageProviderResource = await beanImageProvider.upload(
      { ...input, meta: options?.meta ?? input.meta },
      clientOptions,
      onionOptions,
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
      imageScene: options?.imageScene,
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
    await beanImageProvider.delete(image, clientOptions, onionOptions);
    await this.scope.model.image.deleteById(image.id);
  }

  async getVariantUrl(imageId: TableIdentity, request?: TypeImageVariantInput) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const requestNormalized = this._normalizeVariantRequest(request);
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    return await beanImageProvider.getVariantUrl(
      image,
      requestNormalized,
      clientOptions,
      onionOptions,
    );
  }

  async download(imageId: TableIdentity, request?: TypeImageVariantInput) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const requestNormalized = this._normalizeVariantRequest(request);
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    if (beanImageProvider.download) {
      return await beanImageProvider.download(
        image,
        requestNormalized,
        clientOptions,
        onionOptions,
      );
    }
    return {
      kind: 'url' as const,
      url: await beanImageProvider.getVariantUrl(
        image,
        requestNormalized,
        clientOptions,
        onionOptions,
      ),
      filename: image.filename,
      contentType: image.contentType,
    };
  }

  async resolveView(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord | string,
  ): Promise<IImageView | undefined> {
    const image = await this.get(imageId);
    if (!image) return;
    if (imageScene && image.imageScene !== imageScene) {
      throw new Error(`image scene mismatch: image=${image.imageScene}, expected=${imageScene}`);
    }
    return {
      id: image.id,
      url: await this.getVariantUrl(image.id, request),
      filename: image.filename,
      width: image.width,
      height: image.height,
      provider: image.provider,
      clientName: image.clientName,
      imageScene: image.imageScene,
      uploadedAt: image.uploadedAt,
      variants: image.variants,
    };
  }

  async resolveViews(
    imageIds: TableIdentity[] | undefined,
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord | string,
  ) {
    if (!imageIds?.length) return [];
    const items = await Promise.all(
      imageIds.map(imageId => this.resolveView(imageId, request, imageScene)),
    );
    return items.filter((item): item is IImageView => !!item);
  }

  private async _getImageProviderResource(image: EntityImage) {
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    return await beanImageProvider.get(image, clientOptions, onionOptions);
  }

  private async _getProviderContext(image: EntityImage): Promise<IImageProviderContext> {
    const providerContext = await this.bean.imageProvider.getClientOptions({
      providerName: image.providerName,
      clientName: image.clientName,
    });
    if (!providerContext.entityImageProvider) {
      throw new Error(
        `Image provider not found: ${String(image.providerName)}.${image.clientName}`,
      );
    }
    return {
      beanImageProvider: this._getBeanImageProvider(
        providerContext.beanFullName as keyof IImageProviderRecord,
      ),
      clientOptions: this._normalizeClientOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOnionOptions(providerContext.onionOptions),
    };
  }

  private _getBeanImageProvider(beanFullName: keyof IImageProviderRecord): IImageProviderExecute {
    return this.app.bean._getBean<IImageProviderExecute>(beanFullName as never);
  }

  private _normalizeClientOptions(
    clientOptions: IImageProviderClientOptions | undefined,
  ): IImageProviderClientOptions {
    return clientOptions ?? {};
  }

  private _normalizeOnionOptions(
    onionOptions: IDecoratorImageProviderOptions | undefined,
  ): IDecoratorImageProviderOptions {
    return onionOptions ?? {};
  }

  private _combineImageResource(
    image: EntityImage,
    imageProviderResource?: IImageProviderResource,
  ): IImageResource {
    return {
      id: image.id,
      provider: image.providerName,
      clientName: image.clientName,
      imageScene: image.imageScene,
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

  private _normalizeVariantRequest(request?: TypeImageVariantInput): IImageVariantRequest {
    if (typeof request === 'string') {
      return { variantName: request };
    }
    const defaultVariant = this.scope.config.image.defaultVariant as Parameters<
      typeof resolveImageVariantRequest
    >[1];
    return resolveImageVariantRequest(request ?? {}, defaultVariant);
  }
}
