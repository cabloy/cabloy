import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IImageUploadPolicyResolved, IImageUploadTokenPayload } from '../types/image.ts';
import type {
  IDecoratorImageSceneOptions,
  IDecoratorImageSceneOptionsProvider,
  IImageSceneRecord,
} from '../types/imageScene.ts';

@Bean()
export class BeanImageUploadPolicy extends BeanBase {
  async createUploadToken(data: {
    imageScene: keyof IImageSceneRecord;
    size: number;
    mimeType: string;
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
      },
    );
    return { token };
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

  async resolveUploadPolicy(data: {
    imageScene: keyof IImageSceneRecord;
    size: number;
    mimeType: string;
  }): Promise<IImageUploadPolicyResolved> {
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
