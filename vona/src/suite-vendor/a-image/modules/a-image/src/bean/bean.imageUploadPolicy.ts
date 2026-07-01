import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IImageUploadPolicyResolved, IImageUploadTokenPayload } from '../types/image.ts';
import type { IImageProviderRecord } from '../types/imageProvider.ts';
import type { IDecoratorImageSceneOptions, IImageSceneRecord } from '../types/imageScene.ts';

const __ApiPathImageUpload = '/api/a-image/image/upload';

@Bean()
export class BeanImageUploadPolicy extends BeanBase {
  async createUploadToken(data: {
    imageScene: keyof IImageSceneRecord | string;
    size: number;
    mimeType: string;
  }) {
    const imageConfig = (this.scope as any).config.image as any;
    const payload = await this.resolveUploadPolicy(data);
    const tokenExpiresIn = imageConfig.upload.tokenExpiresIn;
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'imageUpload',
        expiresIn: tokenExpiresIn,
        issuedAt: Date.now(),
        ...payload,
      } as IImageUploadTokenPayload,
      {
        path: __ApiPathImageUpload,
      },
    );
    return {
      token,
      expiresIn: tokenExpiresIn,
    };
  }

  async verifyUploadToken(token?: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: __ApiPathImageUpload,
    })) as IImageUploadTokenPayload | undefined;
    if (!payload || payload.kind !== 'imageUpload') {
      return this.app.throw(401);
    }
    if (Date.now() > payload.issuedAt + payload.expiresIn * 1000) {
      return this.app.throw(401);
    }
    return payload;
  }

  async resolveUploadPolicy(data: {
    imageScene: keyof IImageSceneRecord | string;
    size: number;
    mimeType: string;
  }): Promise<IImageUploadPolicyResolved> {
    const imageConfig = (this.scope as any).config.image as any;
    const imageScene = data.imageScene;
    const sceneOptions = this._getSceneOptions(imageScene);
    const providerName = await this._resolveProviderName(imageScene, sceneOptions);
    const clientName = sceneOptions.clientName ?? imageConfig.defaultClientName;
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
    const maxSize = uploadOptions.maxSize;
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    const mimeType = data.mimeType.toLowerCase();
    if (maxSize && data.size > maxSize) {
      return this.app.throw(403, `image too large: maxSize=${maxSize}`);
    }
    if (mimeTypes.length > 0 && !this._matchesMimeType(mimeType, mimeTypes)) {
      return this.app.throw(403, `unsupported image mimeType: ${mimeType}`);
    }
    return {
      imageScene,
      providerName,
      clientName,
      meta: await this._resolveSceneMeta(sceneOptions),
      maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      multiple: uploadOptions.multiple,
      fileSize: data.size,
      mimeType,
    };
  }

  private _getSceneOptions(
    imageScene: keyof IImageSceneRecord | string,
  ): IDecoratorImageSceneOptions {
    const onionSlice = this.bean.onion.imageScene.getOnionSlice(imageScene as never);
    if (!onionSlice) throw new Error(`not found image scene: ${imageScene}`);
    return onionSlice.beanOptions.options ?? {};
  }

  private async _resolveProviderName(
    imageScene: keyof IImageSceneRecord | string,
    sceneOptions: IDecoratorImageSceneOptions,
  ): Promise<keyof IImageProviderRecord> {
    const providerName = sceneOptions.providerName ?? (await sceneOptions.resolver?.(this.ctx));
    if (providerName) return providerName;
    const providerDefault = (this.scope as any).config.image
      .defaultProvider as keyof IImageProviderRecord;
    if (providerDefault) return providerDefault;
    throw new Error(`should specify image provider for scene: ${imageScene}`);
  }

  private async _resolveSceneMeta(sceneOptions: IDecoratorImageSceneOptions) {
    const meta = sceneOptions.meta;
    if (!meta) return undefined;
    if (typeof meta === 'function') {
      return await meta(this.ctx);
    }
    return meta;
  }

  private _matchesMimeType(mimeType: string, mimeTypes: string[]) {
    return mimeTypes.some(item => {
      if (item === mimeType) return true;
      if (item.endsWith('/*')) {
        return mimeType.startsWith(`${item.slice(0, -1)}`);
      }
      return false;
    });
  }
}
