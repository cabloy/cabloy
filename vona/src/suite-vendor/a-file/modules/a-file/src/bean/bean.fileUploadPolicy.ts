import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IFileDownloadTokenPayload,
  IFileUploadContextResolved,
  IFileUploadPolicyResolved,
  IFileUploadTokenPayload,
} from '../types/file.ts';
import type {
  IDecoratorFileSceneOptions,
  IDecoratorFileSceneOptionsProvider,
  IFileSceneRecord,
} from '../types/fileScene.ts';

import { getFileExtension, matchesFileMimeType } from '../lib/fileUploadValidation.ts';

@Bean()
export class BeanFileUploadPolicy extends BeanBase {
  async createUploadToken(data: {
    fileScene: keyof IFileSceneRecord;
    size: number;
    mimeType: string;
    expiresIn?: number;
  }) {
    const payload = await this.resolveUploadPolicy(data);
    const path = this.scope.util.combineApiPath('file/upload', false, true);
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'fileUpload',
        ...payload,
      } as IFileUploadTokenPayload,
      {
        path,
        expiresIn: data.expiresIn,
      },
    );
    return { token, expiresIn: data.expiresIn };
  }

  async createDownloadToken(data: { fileId: number | string; expiresIn?: number }) {
    const path = this.scope.util.combineApiPath(`file/download/${data.fileId}`, false, true);
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'fileDownload',
        fileId: data.fileId,
      } as IFileDownloadTokenPayload,
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
    })) as IFileUploadTokenPayload | undefined;
    if (!payload || payload.kind !== 'fileUpload') {
      return this.app.throw(401);
    }
    return payload;
  }

  async verifyDownloadToken(token: string | undefined, routePathRaw: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: routePathRaw,
    })) as IFileDownloadTokenPayload | undefined;
    if (!payload || payload.kind !== 'fileDownload') {
      return this.app.throw(401);
    }
    return payload;
  }

  async validateUploadFile(
    file: {
      file: string;
      filename?: string;
      mimeType: string;
    },
    payload: IFileUploadTokenPayload,
  ) {
    const stat = await fse.stat(file.file);
    const fileSize = Number(stat.size);
    if (fileSize !== payload.fileSize) {
      return this.app.throw(403, `file size mismatch: size=${fileSize}`);
    }
    if (payload.maxSize && fileSize > payload.maxSize) {
      return this.app.throw(403, `file too large: maxSize=${payload.maxSize}`);
    }
    const mimeType = file.mimeType.toLowerCase();
    if (mimeType !== payload.mimeType) {
      return this.app.throw(403, `file mimeType mismatch: mimeType=${mimeType}`);
    }
    if (payload.mimeTypes?.length && !matchesFileMimeType(mimeType, payload.mimeTypes)) {
      return this.app.throw(403, `unsupported file mimeType: ${mimeType}`);
    }
    const extension = getFileExtension(file.filename);
    if (payload.extensions?.length && extension && !payload.extensions.includes(extension)) {
      return this.app.throw(403, `unsupported file extension: ${extension}`);
    }
  }

  async resolveUploadContext(data: {
    fileScene: keyof IFileSceneRecord;
  }): Promise<IFileUploadContextResolved> {
    const fileScene = data.fileScene;
    const sceneOptions = this._getSceneOptions(fileScene);
    const { providerName, clientName } = await this._resolveProvider(sceneOptions);
    const providerContext = await this.bean.fileProvider.getClientOptions({
      providerName,
      clientName,
    });
    if (!providerContext.entityFileProvider || providerContext.disabled) {
      return this.app.throw(403, `File provider unavailable: ${providerName}.${clientName}`);
    }
    return {
      fileScene,
      providerName,
      clientName,
      public: this._resolvePublic(providerContext.clientOptions, sceneOptions),
      meta: await this._resolveSceneMeta(sceneOptions),
    };
  }

  async resolveSceneUploadPolicy(data: { fileScene: keyof IFileSceneRecord }) {
    const fileConfig = this.scope.config.file;
    const fileScene = data.fileScene;
    const sceneOptions = this._getSceneOptions(fileScene);
    const { providerName, clientName } = await this._resolveProvider(sceneOptions);
    const providerContext = await this.bean.fileProvider.getClientOptions({
      providerName,
      clientName,
    });
    if (!providerContext.entityFileProvider || providerContext.disabled) {
      return this.app.throw(403, `File provider unavailable: ${providerName}.${clientName}`);
    }
    const uploadOptions = {
      ...(fileConfig.upload ?? {}),
      ...(sceneOptions.upload ?? {}),
    };
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    return {
      fileScene,
      maxSize: uploadOptions.maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      multiple: uploadOptions.multiple,
      public: this._resolvePublic(providerContext.clientOptions, sceneOptions),
    };
  }

  async resolveUploadPolicy(data: {
    fileScene: keyof IFileSceneRecord;
    size: number;
    mimeType: string;
  }): Promise<IFileUploadPolicyResolved> {
    const fileConfig = this.scope.config.file;
    const context = await this.resolveUploadContext({ fileScene: data.fileScene });
    const sceneOptions = this._getSceneOptions(context.fileScene);
    const uploadOptions = {
      ...(fileConfig.upload ?? {}),
      ...(sceneOptions.upload ?? {}),
    };
    const maxSize = uploadOptions.maxSize;
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    const mimeType = data.mimeType.toLowerCase();
    if (maxSize && data.size > maxSize) {
      return this.app.throw(403, `file too large: maxSize=${maxSize}`);
    }
    if (mimeTypes.length > 0 && !matchesFileMimeType(mimeType, mimeTypes)) {
      return this.app.throw(403, `unsupported file mimeType: ${mimeType}`);
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

  private _getSceneOptions(fileScene: keyof IFileSceneRecord): IDecoratorFileSceneOptions {
    const onionSlice = this.bean.onion.fileScene.getOnionSlice(fileScene);
    if (!onionSlice) throw new Error(`not found file scene: ${fileScene}`);
    return onionSlice.beanOptions.options ?? {};
  }

  private async _resolveProvider(
    sceneOptions: IDecoratorFileSceneOptions,
  ): Promise<Required<IDecoratorFileSceneOptionsProvider>> {
    const provider =
      typeof sceneOptions.provider === 'function'
        ? await sceneOptions.provider(this.ctx)
        : sceneOptions.provider;
    const providerName = provider?.providerName ?? this.scope.config.file.defaultProvider;
    const clientName = provider?.clientName ?? this.scope.config.file.defaultClientName;
    return { providerName, clientName };
  }

  private async _resolveSceneMeta(sceneOptions: IDecoratorFileSceneOptions) {
    const meta = sceneOptions.meta;
    if (!meta) return undefined;
    if (typeof meta === 'function') {
      return await meta(this.ctx);
    }
    return meta;
  }

  private _resolvePublic(
    clientOptions: { public?: boolean } | undefined,
    sceneOptions: IDecoratorFileSceneOptions,
  ) {
    return sceneOptions.public ?? clientOptions?.public ?? this.scope.config.file.public ?? false;
  }
}
