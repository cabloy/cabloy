import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityImage } from '../entity/image.ts';
import type {
  IImageDeliveryOptions,
  IImageDirectUploadInput,
  IImageDirectUploadResult,
  IImageProviderDirectUploadResource,
  IImageProviderResource,
  IImageResource,
  IImageUploadContextResolved,
  IImageUploadInput,
  IImageUploadOptions,
  IImageUploadUrlInput,
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
    const providerContext = await this._getProviderContextByInput(providerName, options);
    const imageProviderResource = await providerContext.beanImageProvider.upload(
      { ...input, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const image = await this._insertImage(
      providerName,
      providerContext.clientName,
      imageProviderResource,
      {
        imageScene: options?.imageScene,
      },
    );
    return this._combineImageResource(image, imageProviderResource);
  }

  async uploadUrl<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageUploadUrlInput,
    options?: IImageUploadOptions,
  ): Promise<IImageResource> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanImageProvider.uploadUrl) {
      throw new Error(`Image provider does not support uploadUrl: ${String(providerName)}`);
    }
    const imageProviderResource = await providerContext.beanImageProvider.uploadUrl(
      { ...input, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const image = await this._insertImage(
      providerName,
      providerContext.clientName,
      imageProviderResource,
      {
        imageScene: options?.imageScene,
      },
    );
    return this._combineImageResource(image, imageProviderResource);
  }

  async createDirectUpload<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageDirectUploadInput,
    options?: IImageUploadOptions,
  ): Promise<IImageDirectUploadResult> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanImageProvider.createDirectUpload) {
      throw new Error(
        `Image provider does not support createDirectUpload: ${String(providerName)}`,
      );
    }
    const imageProviderResource = await providerContext.beanImageProvider.createDirectUpload(
      { ...input, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const image = await this._insertImage(
      providerName,
      providerContext.clientName,
      imageProviderResource,
      {
        imageScene: options?.imageScene,
      },
    );
    return {
      ...this._combineImageResource(image, imageProviderResource),
      uploadUrl: imageProviderResource.uploadUrl,
      draft: imageProviderResource.draft,
    };
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

  async getVariantUrl(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const requestNormalized = this._normalizeVariantRequest(request);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(
      image,
      requestNormalized,
      deliveryOptions,
    );
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    if (
      deliveryOptionsResolved.signed &&
      (clientOptions.signedDeliveryKind ?? 'proxy') === 'proxy'
    ) {
      return await this._createSignedDeliveryUrl(
        image.id,
        requestNormalized,
        deliveryOptionsResolved,
      );
    }
    return await beanImageProvider.getVariantUrl(
      image,
      requestNormalized,
      clientOptions,
      onionOptions,
      deliveryOptionsResolved,
    );
  }

  async download(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const requestNormalized = this._normalizeVariantRequest(request);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(
      image,
      requestNormalized,
      deliveryOptions,
    );
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    if (
      deliveryOptionsResolved.signed &&
      (clientOptions.signedDeliveryKind ?? 'proxy') === 'proxy'
    ) {
      return {
        kind: 'url' as const,
        url: await this._createSignedDeliveryUrl(
          image.id,
          requestNormalized,
          deliveryOptionsResolved,
        ),
        filename: image.filename,
        contentType: image.contentType,
        signed: true,
      };
    }
    if (beanImageProvider.download) {
      return await beanImageProvider.download(
        image,
        requestNormalized,
        clientOptions,
        onionOptions,
        deliveryOptionsResolved,
      );
    }
    return {
      kind: 'url' as const,
      url: await beanImageProvider.getVariantUrl(
        image,
        requestNormalized,
        clientOptions,
        onionOptions,
        deliveryOptionsResolved,
      ),
      filename: image.filename,
      contentType: image.contentType,
      signed: !!deliveryOptionsResolved.signed,
    };
  }

  async resolveView(
    imageId?: TableIdentity,
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageView | undefined> {
    if (!imageId) return;
    const image = await this.get(imageId);
    if (!image) return;
    if (imageScene && image.imageScene !== imageScene) {
      throw new Error(`image scene mismatch: image=${image.imageScene}, expected=${imageScene}`);
    }
    const requestNormalized = this._normalizeVariantRequest(request);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(
      image,
      requestNormalized,
      deliveryOptions,
    );
    return {
      id: image.id,
      url: await this.getVariantUrl(image.id, requestNormalized, deliveryOptionsResolved),
      filename: image.filename,
      width: image.width,
      height: image.height,
      provider: image.provider,
      clientName: image.clientName,
      imageScene: image.imageScene,
      uploadedAt: image.uploadedAt,
      variants: image.variants,
      signed: !!deliveryOptionsResolved.signed,
    };
  }

  async resolveViews(
    imageIds?: TableIdentity[],
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    if (!imageIds) return;
    if (!imageIds.length) return [];
    const items = await Promise.all(
      imageIds.map(imageId => this.resolveView(imageId, request, imageScene, deliveryOptions)),
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

  private async _getProviderContextByInput<N extends keyof IImageProviderRecord>(
    providerName: N,
    options?: IImageUploadOptions,
  ) {
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
    return {
      clientName,
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

  private _normalizeVariantRequest(request?: TypeImageVariantInput): IImageVariantRequest {
    if (typeof request === 'string') {
      return { variantName: request };
    }
    const defaultVariant = this.scope.config.image.defaultVariant as Parameters<
      typeof resolveImageVariantRequest
    >[1];
    return resolveImageVariantRequest(request ?? {}, defaultVariant);
  }

  private _mergeDeliveryOptions(
    image: Pick<IImageResource, 'requireSignedURLs'>,
    request: IImageVariantRequest,
    deliveryOptions?: IImageDeliveryOptions,
  ): IImageDeliveryOptions {
    const signed = deliveryOptions?.signed ?? request.signed ?? image.requireSignedURLs ?? false;
    const expiresIn = deliveryOptions?.expiresIn ?? request.expiresIn;
    const expiresAt = deliveryOptions?.expiresAt ?? request.expiresAt;
    const responseMode = deliveryOptions?.responseMode ?? request.responseMode;
    return {
      signed,
      expiresIn,
      expiresAt,
      responseMode,
    };
  }

  private async _createSignedDeliveryUrl(
    imageId: TableIdentity,
    request: IImageVariantRequest,
    deliveryOptions: IImageDeliveryOptions,
  ) {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    const { beanImageProvider, clientOptions, onionOptions } =
      await this._getProviderContext(image);
    const targetUrl = await beanImageProvider.getVariantUrl(
      image,
      request,
      clientOptions,
      onionOptions,
      {
        signed: false,
        responseMode: 'url',
      },
    );
    const routePath = this.scope.util.combineApiPath(`image/delivery/${imageId}`, false, true);
    const tokenPayload = await this.bean.imageUploadPolicy.createDeliveryToken({
      imageId,
      request,
      targetUrl,
      expiresIn: deliveryOptions.expiresIn,
    });
    const routeUrl = this.app.util.getAbsoluteUrlByApiPath(routePath);
    const url = new URL(routeUrl);
    url.searchParams.set('token', tokenPayload.token);
    return url.toString();
  }

  private async _insertImage(
    providerName: keyof IImageProviderRecord,
    clientName: string,
    imageProviderResource: IImageProviderResource | IImageProviderDirectUploadResource,
    context?: Partial<IImageUploadContextResolved>,
  ) {
    return await this.scope.model.image.insert({
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
      imageScene: context?.imageScene,
    });
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
}
