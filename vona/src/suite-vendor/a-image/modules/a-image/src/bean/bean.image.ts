import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityImage } from '../entity/image.ts';
import type {
  IImageActionResponse,
  IImageDeliveryOptions,
  IImageDirectUploadInput,
  IImageDirectUploadResponse,
  IImageFinalizeDirectUploadResult,
  IImageProviderDeliveryOptions,
  IImageProviderDirectUploadResource,
  IImageProviderResource,
  IImageResource,
  IImageUploadInput,
  IImageUploadOptions,
  IImageUploadUrlInput,
  IImageVariantRequest,
  IImageView,
  TypeImageVariantInput,
} from '../types/image.ts';
import type {
  IImageProviderRecord,
  TypeImageProviderClientOptionsByName,
  TypeImageProviderExecuteByName,
  TypeImageProviderOptionsByName,
} from '../types/imageProvider.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

import { resolveImageVariantRequest } from '../lib/imageVariant.ts';

interface IImageProviderContext<N extends keyof IImageProviderRecord = keyof IImageProviderRecord> {
  beanImageProvider: TypeImageProviderExecuteByName<N>;
  clientOptions: TypeImageProviderClientOptionsByName<N>;
  onionOptions: TypeImageProviderOptionsByName<N>;
}

interface IImageDeliveryOptionsResolved extends IImageProviderDeliveryOptions {
  audience: boolean;
}

interface IImageDeliveryContext {
  image: EntityImage | IImageResource;
  providerImage: EntityImage;
  requestNormalized: IImageVariantRequest;
  deliveryOptionsResolved: IImageDeliveryOptionsResolved;
  providerContext: IImageProviderContext;
}

interface IInsertImageContext {
  imageScene?: keyof IImageSceneRecord;
  status?: EntityImage['status'];
  draftExpiresAt?: Date;
  finalizedAt?: Date;
}

@Bean()
export class BeanImage extends BeanBase {
  async upload<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageUploadInput,
    options?: IImageUploadOptions<TypeImageProviderClientOptionsByName<N>>,
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
        status: 'ready',
      },
    );
    return this._combineImageResource(image, imageProviderResource);
  }

  async uploadUrl<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageUploadUrlInput,
    options?: IImageUploadOptions<TypeImageProviderClientOptionsByName<N>>,
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
        status: 'ready',
      },
    );
    return this._combineImageResource(image, imageProviderResource);
  }

  async createDirectUpload<N extends keyof IImageProviderRecord>(
    providerName: N,
    input: IImageDirectUploadInput,
    options?: IImageUploadOptions<TypeImageProviderClientOptionsByName<N>>,
  ): Promise<IImageDirectUploadResponse> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanImageProvider.createDirectUpload) {
      return this.app.throw(
        403,
        `Image provider does not support createDirectUpload: ${String(providerName)}`,
      );
    }
    const imageProviderResource = await providerContext.beanImageProvider.createDirectUpload(
      { ...input, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const isDraft = imageProviderResource.draft ?? true;
    const draftExpiresAt = isDraft
      ? this._resolveDirectUploadDraftExpiresAt(input.expiry)
      : undefined;
    const image = await this._insertImage(
      providerName,
      providerContext.clientName,
      imageProviderResource,
      {
        imageScene: options?.imageScene,
        status: isDraft ? 'draft' : 'ready',
        draftExpiresAt,
      },
    );
    return {
      id: image.id,
      uploadUrl: imageProviderResource.uploadUrl,
      filename: imageProviderResource.filename,
      public: imageProviderResource.public ?? image.public,
    } satisfies IImageDirectUploadResponse;
  }

  async finalizeDirectUpload(imageId: TableIdentity): Promise<IImageFinalizeDirectUploadResult> {
    return await this.scope.redlock.lock(`image.directUpload.${imageId}`, async () => {
      const image = await this.scope.model.image.getById(imageId);
      if (!image) throw new Error(`not found image: ${imageId}`);
      if (image.status !== 'draft') {
        return this.app.throw(403, `image is not draft: ${imageId}`);
      }
      const draftExpiresAt = this._normalizeDate(image.draftExpiresAt);
      if (draftExpiresAt && draftExpiresAt.getTime() < Date.now()) {
        await this.scope.model.image.updateById(image.id, {
          status: 'expired',
        });
        return this.app.throw(403, `image draft expired: ${imageId}`);
      }
      const providerContext = await this._getProviderContext(image);
      if (!providerContext.beanImageProvider.finalizeDirectUpload) {
        return this.app.throw(
          403,
          `Image provider does not support finalizeDirectUpload: ${String(image.providerName)}`,
        );
      }
      const imageProviderResource = await providerContext.beanImageProvider.finalizeDirectUpload(
        image,
        providerContext.clientOptions,
        providerContext.onionOptions,
      );
      if (!imageProviderResource) {
        return this.app.throw(403, `image direct upload not ready: ${imageId}`);
      }
      const finalizedAt = new Date();
      const imageUpdated = await this.scope.model.image.updateById(
        image.id,
        this._buildImagePersistData(imageProviderResource, {
          status: 'ready',
          draftExpiresAt,
          finalizedAt,
        }),
      );
      return this._combineImageResource(
        {
          ...image,
          ...imageUpdated,
        },
        imageProviderResource,
      );
    });
  }

  async get(imageId: TableIdentity): Promise<IImageResource | undefined> {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) return;
    const imageProviderResource = await this._getImageProviderResource(image);
    return this._combineImageResource(image, imageProviderResource);
  }

  async expireDraftImage(imageId: TableIdentity) {
    return await this.scope.redlock.lock(`image.directUpload.${imageId}`, async () => {
      const image = await this.scope.model.image.getById(imageId);
      if (!image || image.status !== 'draft') return;
      const draftExpiresAt = this._normalizeDate(image.draftExpiresAt);
      if (!draftExpiresAt || draftExpiresAt.getTime() >= Date.now()) return;
      const { beanImageProvider, clientOptions, onionOptions } =
        await this._getProviderContext(image);
      await beanImageProvider.delete(image, clientOptions, onionOptions);
      await this.scope.model.image.updateById(image.id, {
        status: 'expired',
      });
    });
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
    const context = await this._getDeliveryContext(imageId, request, deliveryOptions);
    return await this._getVariantUrlByContext(context);
  }

  async download(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    const context = await this._getDeliveryContext(imageId, request, deliveryOptions);
    if (this._shouldUseProxySignedDelivery(context)) {
      return {
        kind: 'url' as const,
        url: await this._createSignedDeliveryUrl(context),
        filename: context.image.filename,
        contentType: context.image.contentType,
        signed: true,
      };
    }
    return await this._downloadFromProvider(context);
  }

  async downloadForDelivery(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    options?: { protected?: boolean },
  ) {
    const context = await this._getDeliveryContext(imageId, request, { responseMode: 'buffer' });
    return await this._downloadFromProvider({
      ...context,
      deliveryOptionsResolved: {
        protected: options?.protected ?? !context.image.public,
        audience: false,
        responseMode: 'buffer',
      },
    });
  }

  async resolveView(
    imageId?: TableIdentity,
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageView | undefined> {
    if (!imageId) return;
    const prepared = await this._prepareImageView(imageId, request, imageScene, deliveryOptions);
    if (!prepared) return;
    return await this._createImageView(prepared.image, prepared.context);
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

  private async _prepareImageView(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    imageScene?: keyof IImageSceneRecord,
    deliveryOptions?: IImageDeliveryOptions,
  ) {
    const image = await this.get(imageId);
    if (!image) return;
    if (imageScene && image.imageScene !== imageScene) {
      throw new Error(`image scene mismatch: image=${image.imageScene}, expected=${imageScene}`);
    }
    const context = await this._createDeliveryContext(image, request, deliveryOptions);
    return { image, context };
  }

  private async _getProviderContext(
    image:
      | Pick<EntityImage, 'providerName' | 'clientName'>
      | Pick<IImageResource, 'provider' | 'clientName'>,
  ): Promise<IImageProviderContext> {
    const providerName = 'providerName' in image ? image.providerName : image.provider;
    const providerContext = await this.bean.imageProvider.getClientOptions({
      providerName,
      clientName: image.clientName,
    });
    if (!providerContext.entityImageProvider) {
      throw new Error(`Image provider not found: ${String(providerName)}.${image.clientName}`);
    }
    return {
      beanImageProvider: this._getBeanImageProvider(providerName, providerContext.beanFullName),
      clientOptions: this._normalizeOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOptions(providerContext.onionOptions),
    };
  }

  private async _getProviderContextByInput<N extends keyof IImageProviderRecord>(
    providerName: N,
    options?: IImageUploadOptions<TypeImageProviderClientOptionsByName<N>>,
  ): Promise<IImageProviderContext<N> & { clientName: string }> {
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
      beanImageProvider: this._getBeanImageProvider(providerName, providerContext.beanFullName),
      clientOptions: this._normalizeOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOptions(providerContext.onionOptions),
    };
  }

  private _getBeanImageProvider<N extends keyof IImageProviderRecord>(
    _providerName: N,
    beanFullName: string,
  ): TypeImageProviderExecuteByName<N> {
    return this.app.bean._getBean<TypeImageProviderExecuteByName<N>>(beanFullName as never);
  }

  private _normalizeOptions<T extends object>(options: T | undefined): T {
    return (options ?? {}) as T;
  }

  async createImageActionResponse(
    image: IImageResource,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageActionResponse> {
    const context = await this._createDeliveryContext(image, request, deliveryOptions);
    return {
      id: image.id,
      filename: image.filename,
      contentType: image.contentType,
      size: image.size,
      width: image.width,
      height: image.height,
      public: image.public,
      url: await this._getVariantUrlByContext(context),
      signed: context.deliveryOptionsResolved.protected,
    } satisfies IImageActionResponse;
  }

  private _resolveDirectUploadDraftExpiresAt(expiry?: IImageDirectUploadInput['expiry']) {
    return (
      this._normalizeDate(expiry) ??
      new Date(Date.now() + this.scope.config.image.directUpload.draftExpiresIn)
    );
  }

  private _normalizeDate(value: unknown) {
    if (!value) return undefined;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value;
    }
    const date = new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  private async _getDeliveryContext(
    imageId: TableIdentity,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageDeliveryContext> {
    const image = await this.scope.model.image.getById(imageId);
    if (!image) throw new Error(`not found image: ${imageId}`);
    return await this._createDeliveryContext(image, request, deliveryOptions);
  }

  private async _createDeliveryContext(
    image: EntityImage | IImageResource,
    request?: TypeImageVariantInput,
    deliveryOptions?: IImageDeliveryOptions,
  ): Promise<IImageDeliveryContext> {
    this._assertImageReady(image);
    const providerImage = this._getProviderImage(image);
    const requestNormalized = this._normalizeVariantRequest(request);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(
      image,
      requestNormalized,
      deliveryOptions,
    );
    const providerContext = await this._getProviderContext(image);
    return {
      image,
      providerImage,
      requestNormalized,
      deliveryOptionsResolved,
      providerContext,
    };
  }

  private async _downloadFromProvider(context: IImageDeliveryContext) {
    if (context.providerContext.beanImageProvider.download) {
      return await context.providerContext.beanImageProvider.download(
        context.providerImage,
        context.requestNormalized,
        context.providerContext.clientOptions,
        context.providerContext.onionOptions,
        context.deliveryOptionsResolved,
      );
    }
    return {
      kind: 'url' as const,
      url: await context.providerContext.beanImageProvider.getVariantUrl(
        context.providerImage,
        context.requestNormalized,
        context.providerContext.clientOptions,
        context.providerContext.onionOptions,
        context.deliveryOptionsResolved,
      ),
      filename: context.image.filename,
      contentType: context.image.contentType,
      signed: context.deliveryOptionsResolved.protected,
    };
  }

  private async _getVariantUrlByContext(context: IImageDeliveryContext) {
    if (this._shouldUseProxySignedDelivery(context)) {
      return await this._createSignedDeliveryUrl(context);
    }
    return await context.providerContext.beanImageProvider.getVariantUrl(
      context.providerImage,
      context.requestNormalized,
      context.providerContext.clientOptions,
      context.providerContext.onionOptions,
      context.deliveryOptionsResolved,
    );
  }

  private async _createImageView(image: IImageResource, context: IImageDeliveryContext) {
    return {
      id: image.id,
      url: await this._getVariantUrlByContext(context),
      filename: image.filename,
      width: image.width,
      height: image.height,
      public: image.public,
      signed: context.deliveryOptionsResolved.protected,
    } satisfies IImageView;
  }

  private _shouldUseProxySignedDelivery(context: IImageDeliveryContext) {
    const { deliveryOptionsResolved, providerContext } = context;
    return (
      deliveryOptionsResolved.protected &&
      (deliveryOptionsResolved.audience ||
        (providerContext.clientOptions.signedDeliveryKind ?? 'proxy') === 'proxy')
    );
  }

  private _assertImageReady(image: Pick<EntityImage, 'id' | 'status'>) {
    if (image.status === 'draft') {
      return this.app.throw(403, `image draft not ready: ${image.id}`);
    }
    if (image.status === 'expired') {
      return this.app.throw(403, `image draft expired: ${image.id}`);
    }
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
    image: Pick<IImageResource, 'public'>,
    request: IImageVariantRequest,
    deliveryOptions?: IImageDeliveryOptions,
  ): IImageDeliveryOptionsResolved {
    const audience = deliveryOptions?.audience ?? request.audience ?? false;
    return {
      protected: audience || !image.public,
      expiresIn:
        deliveryOptions?.expiresIn ??
        request.expiresIn ??
        (audience ? this.scope.config.image.delivery.audienceExpiresIn : undefined),
      audience,
      responseMode: deliveryOptions?.responseMode ?? request.responseMode,
    };
  }

  private async _createSignedDeliveryUrl(context: IImageDeliveryContext) {
    const routePath = this.scope.util.combineApiPath('image/delivery', false, true);
    const audienceUserId = this._resolveAudienceUserId(context.deliveryOptionsResolved);
    const tokenPayload = await this.bean.imageUploadPolicy.createDeliveryToken({
      imageId: context.image.id,
      request: context.requestNormalized,
      expiresIn: context.deliveryOptionsResolved.expiresIn,
      audienceUserId,
    });
    const routeUrl = this.app.util.getAbsoluteUrlByApiPath(routePath);
    const url = new URL(routeUrl);
    url.searchParams.set('imageId', String(context.image.id));
    url.searchParams.set('token', tokenPayload.token);
    return url.toString();
  }

  private _resolveAudienceUserId(deliveryOptions: IImageDeliveryOptionsResolved) {
    if (!deliveryOptions.audience) return;
    const user = this.bean.passport.currentUser;
    if (!user || user.anonymous) return this.app.throw(401);
    return user.id;
  }

  private _getProviderImage(image: EntityImage | IImageResource): EntityImage {
    if ('providerName' in image) return image;
    return {
      id: image.id,
      providerName: image.provider,
      clientName: image.clientName,
      resourceId: image.resourceId,
      filename: image.filename,
      contentType: image.contentType,
      size: image.size,
      width: image.width,
      height: image.height,
      public: image.public,
      variants: image.variants,
      meta: image.meta,
      storagePath: image.storagePath,
      deliveryBaseUrl: image.deliveryBaseUrl,
      imageScene:
        typeof image.imageScene === 'string'
          ? (image.imageScene as keyof IImageSceneRecord)
          : undefined,
      status: image.status,
      draftExpiresAt: image.draftExpiresAt,
      finalizedAt: image.finalizedAt,
      createdAt: image.uploadedAt ?? new Date(0),
      updatedAt: image.uploadedAt ?? new Date(0),
      deleted: false,
      iid: 0,
    } satisfies EntityImage;
  }

  private _buildImagePersistData(
    imageProviderResource: IImageProviderResource | IImageProviderDirectUploadResource,
    context?: IInsertImageContext,
  ) {
    return {
      resourceId: imageProviderResource.resourceId,
      filename: imageProviderResource.filename,
      contentType: imageProviderResource.contentType,
      size: imageProviderResource.size,
      width: imageProviderResource.width,
      height: imageProviderResource.height,
      public: imageProviderResource.public,
      variants: imageProviderResource.variants,
      meta: imageProviderResource.meta,
      storagePath: imageProviderResource.storagePath,
      deliveryBaseUrl: imageProviderResource.deliveryBaseUrl,
      imageScene: context?.imageScene,
      status: context?.status,
      draftExpiresAt: context?.draftExpiresAt,
      finalizedAt: context?.finalizedAt,
    };
  }

  private async _insertImage(
    providerName: keyof IImageProviderRecord,
    clientName: string,
    imageProviderResource: IImageProviderResource | IImageProviderDirectUploadResource,
    context?: IInsertImageContext,
  ) {
    return await this.scope.model.image.insert({
      providerName,
      clientName,
      ...this._buildImagePersistData(imageProviderResource, context),
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
      status: image.status,
      draftExpiresAt: image.status === 'draft' ? image.draftExpiresAt : undefined,
      finalizedAt: image.finalizedAt,
      resourceId: imageProviderResource?.resourceId ?? image.resourceId,
      filename: imageProviderResource?.filename ?? image.filename,
      contentType: imageProviderResource?.contentType ?? image.contentType,
      size: imageProviderResource?.size ?? image.size,
      width: imageProviderResource?.width ?? image.width,
      height: imageProviderResource?.height ?? image.height,
      public: imageProviderResource?.public ?? image.public,
      variants: imageProviderResource?.variants ?? image.variants,
      meta: imageProviderResource?.meta ?? image.meta,
      storagePath: imageProviderResource?.storagePath ?? image.storagePath,
      deliveryBaseUrl: imageProviderResource?.deliveryBaseUrl ?? image.deliveryBaseUrl,
      raw: imageProviderResource?.raw,
      uploadedAt: image.createdAt,
    };
  }
}
