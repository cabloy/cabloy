import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IImageDeliveryTokenPayload,
  IImageDirectUploadTokenPayload,
  IImageUploadContextResolved,
  IImageUploadPolicyResolved,
  IImageUploadTokenPayload,
} from '../types/image.ts';
import type {
  IDecoratorImageSceneOptions,
  IDecoratorImageSceneOptionsProvider,
  IImageSceneRecord,
} from '../types/imageScene.ts';

import { getImageExtension, matchesImageMimeType } from '../lib/imageUploadValidation.ts';

@Bean()
export class BeanImageUploadPolicy extends BeanBase {
  async createUploadToken(data: {
    imageScene: keyof IImageSceneRecord;
    size: number;
    mimeType: string;
    expiresIn?: number;
  }) {
    const payload = await this.resolveUploadPolicy(data);
    const path = this.scope.util.combineApiPath('image/upload', false, true);
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'imageUpload',
        ...payload,
      } as IImageUploadTokenPayload,
      {
        path,
        expiresIn: data.expiresIn,
      },
    );
    return { token, expiresIn: data.expiresIn };
  }

  async createDirectUploadToken(data: { resourceId: string; path: string; expiresIn?: number }) {
    const path = data.path;
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'imageDirectUpload',
        resourceId: data.resourceId,
      } as IImageDirectUploadTokenPayload,
      {
        path,
        expiresIn: data.expiresIn,
      },
    );
    return { token, expiresIn: data.expiresIn };
  }

  async createDeliveryToken(data: {
    imageId: number | string;
    request: IImageDeliveryTokenPayload['request'];
    targetUrl: string;
    expiresIn?: number;
  }) {
    const path = this.scope.util.combineApiPath(`image/delivery/${data.imageId}`, false, true);
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'imageDelivery',
        imageId: data.imageId,
        request: data.request,
        targetUrl: data.targetUrl,
      } as IImageDeliveryTokenPayload,
      {
        path,
        expiresIn: data.expiresIn,
      },
    );
    return { token, expiresIn: data.expiresIn };
  }

  async verifyUploadToken(token: string | undefined, routePathRaw: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: routePathRaw,
    })) as IImageUploadTokenPayload | undefined;
    if (!payload || payload.kind !== 'imageUpload') {
      return this.app.throw(401);
    }
    return payload;
  }

  async verifyDirectUploadToken(token: string | undefined, routePathRaw: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: routePathRaw,
    })) as IImageDirectUploadTokenPayload | undefined;
    if (!payload || payload.kind !== 'imageDirectUpload') {
      return this.app.throw(401);
    }
    return payload;
  }

  async verifyDeliveryToken(token: string | undefined, routePathRaw: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: routePathRaw,
    })) as IImageDeliveryTokenPayload | undefined;
    if (!payload || payload.kind !== 'imageDelivery') {
      return this.app.throw(401);
    }
    return payload;
  }

  async resolveUploadContext(data: {
    imageScene: keyof IImageSceneRecord;
  }): Promise<IImageUploadContextResolved> {
    const imageScene = data.imageScene;
    const sceneOptions = this._getSceneOptions(imageScene);
    const { providerName, clientName } = await this._resolveProvider(sceneOptions);
    return {
      imageScene,
      providerName,
      clientName,
      meta: await this._resolveSceneMeta(sceneOptions),
    };
  }

  async resolveSceneUploadPolicy(data: { imageScene: keyof IImageSceneRecord }) {
    const imageConfig = this.scope.config.image;
    const imageScene = data.imageScene;
    const sceneOptions = this._getSceneOptions(imageScene);
    const { providerName, clientName } = await this._resolveProvider(sceneOptions);
    const { entityImageProvider, disabled } = await this.bean.imageProvider.getClientOptions({
      providerName,
      clientName,
    });
    if (!entityImageProvider || disabled) {
      return this.app.throw(403, `Image provider unavailable: ${providerName}.${clientName}`);
    }
    const uploadOptions = {
      ...(imageConfig.upload ?? {}),
      ...(sceneOptions.upload ?? {}),
    };
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    return {
      imageScene,
      maxSize: uploadOptions.maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      multiple: uploadOptions.multiple,
    };
  }

  async resolveUploadPolicy(data: {
    imageScene: keyof IImageSceneRecord;
    size: number;
    mimeType: string;
  }): Promise<IImageUploadPolicyResolved> {
    const imageConfig = this.scope.config.image;
    const context = await this.resolveUploadContext({ imageScene: data.imageScene });
    const { entityImageProvider, disabled } = await this.bean.imageProvider.getClientOptions({
      providerName: context.providerName,
      clientName: context.clientName,
    });
    if (!entityImageProvider || disabled) {
      return this.app.throw(
        403,
        `Image provider unavailable: ${context.providerName}.${context.clientName}`,
      );
    }
    const sceneOptions = this._getSceneOptions(context.imageScene);
    const uploadOptions = {
      ...(imageConfig.upload ?? {}),
      ...(sceneOptions.upload ?? {}),
    };
    const maxSize = uploadOptions.maxSize;
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    const mimeType = data.mimeType.toLowerCase();
    if (maxSize && data.size > maxSize) {
      return this.app.throw(403, `image too large: maxSize=${maxSize}`);
    }
    if (mimeTypes.length > 0 && !matchesImageMimeType(mimeType, mimeTypes)) {
      return this.app.throw(403, `unsupported image mimeType: ${mimeType}`);
    }
    return {
      ...context,
      maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      multiple: uploadOptions.multiple,
      fileSize: data.size,
      mimeType,
    };
  }

  async validateUploadFile(
    file: {
      file: string;
      filename?: string;
      mimeType: string;
    },
    payload: IImageUploadPolicyResolved,
  ) {
    const stat = await fse.stat(file.file);
    const fileSize = Number(stat.size);
    if (fileSize !== payload.fileSize) {
      return this.app.throw(403, `image size mismatch: size=${fileSize}`);
    }
    if (payload.maxSize && fileSize > payload.maxSize) {
      return this.app.throw(403, `image too large: maxSize=${payload.maxSize}`);
    }
    const mimeType = file.mimeType.toLowerCase();
    if (mimeType !== payload.mimeType) {
      return this.app.throw(403, `image mimeType mismatch: mimeType=${mimeType}`);
    }
    if (payload.mimeTypes?.length && !matchesImageMimeType(mimeType, payload.mimeTypes)) {
      return this.app.throw(403, `unsupported image mimeType: ${mimeType}`);
    }
    const extension = getImageExtension(file.filename);
    if (payload.extensions?.length && extension && !payload.extensions.includes(extension)) {
      return this.app.throw(403, `unsupported image extension: ${extension}`);
    }
  }

  private _getSceneOptions(imageScene: keyof IImageSceneRecord): IDecoratorImageSceneOptions {
    const onionSlice = this.bean.onion.imageScene.getOnionSlice(imageScene);
    if (!onionSlice) throw new Error(`not found image scene: ${imageScene}`);
    return onionSlice.beanOptions.options ?? {};
  }

  private async _resolveProvider(
    sceneOptions: IDecoratorImageSceneOptions,
  ): Promise<Required<IDecoratorImageSceneOptionsProvider>> {
    const provider =
      typeof sceneOptions.provider === 'function'
        ? await sceneOptions.provider(this.ctx)
        : sceneOptions.provider;
    const providerName = provider?.providerName ?? this.scope.config.image.defaultProvider;
    const clientName = provider?.clientName ?? this.scope.config.image.defaultClientName;
    return { providerName, clientName };
  }

  private async _resolveSceneMeta(sceneOptions: IDecoratorImageSceneOptions) {
    const meta = sceneOptions.meta;
    if (!meta) return undefined;
    if (typeof meta === 'function') {
      return await meta(this.ctx);
    }
    return meta;
  }
}
