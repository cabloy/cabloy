import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IFileDownloadTokenPayload,
  IFileUploadContextResolved,
  IFileUploadPolicyResolved,
} from '../types/file.ts';
import type { IFileProviderExecute } from '../types/fileProvider.ts';
import type {
  IDecoratorFileSceneOptions,
  IDecoratorFileSceneOptionsProvider,
  IFileSceneRecord,
} from '../types/fileScene.ts';

import { getFileExtension, matchesFileMimeType } from '../lib/fileUploadValidation.ts';

@Bean()
export class BeanFileUploadPolicy extends BeanBase {
  async createDownloadToken(data: {
    fileId: number | string;
    expiresIn?: number;
    audienceUserId?: IFileDownloadTokenPayload['audienceUserId'];
  }) {
    const path = this.scope.util.combineApiPath(`file/download/${data.fileId}`, false, true);
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'fileDownload',
        fileId: data.fileId,
        audienceUserId: data.audienceUserId,
      } as IFileDownloadTokenPayload,
      {
        path,
        expiresIn: data.expiresIn,
      },
    );
    return { token, expiresIn: data.expiresIn };
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
    policy: IFileUploadPolicyResolved,
  ) {
    const stat = await fse.stat(file.file);
    const fileSize = Number(stat.size);
    if (policy.maxSize && fileSize > policy.maxSize) {
      return this.app.throw(403, `file too large: maxSize=${policy.maxSize}`);
    }
    const mimeType = file.mimeType.toLowerCase();
    if (policy.mimeTypes?.length && !matchesFileMimeType(mimeType, policy.mimeTypes)) {
      return this.app.throw(403, `unsupported file mimeType: ${mimeType}`);
    }
    const extension = getFileExtension(file.filename);
    if (policy.extensions?.length && (!extension || !policy.extensions.includes(extension))) {
      return this.app.throw(403, `unsupported file extension: ${extension ?? '(none)'}`);
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
    const {
      entityFileProvider,
      disabled,
      beanFullName,
      clientOptions: providerClientOptions,
    } = await this.bean.fileProvider.getClientOptions({
      providerName,
      clientName,
    });
    if (!entityFileProvider || disabled) {
      return this.app.throw(403, `File provider unavailable: ${providerName}.${clientName}`);
    }
    const fileProvider = this.app.bean._getBean<IFileProviderExecute>(beanFullName as never);
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
      public: this._resolvePublic(providerClientOptions, sceneOptions),
      directUpload:
        typeof fileProvider.createDirectUpload === 'function' &&
        typeof fileProvider.finalizeDirectUpload === 'function',
    };
  }

  async resolveUploadUrlPolicy(data: {
    fileScene: keyof IFileSceneRecord;
  }): Promise<Omit<IFileUploadPolicyResolved, 'fileSize' | 'mimeType'>> {
    const fileConfig = this.scope.config.file;
    const context = await this.resolveUploadContext({ fileScene: data.fileScene });
    const sceneOptions = this._getSceneOptions(context.fileScene);
    const uploadOptions = {
      ...(fileConfig.upload ?? {}),
      ...(sceneOptions.upload ?? {}),
    };
    const mimeTypes = [...(uploadOptions.mimeTypes ?? [])];
    const extensions = [...(uploadOptions.extensions ?? [])];
    return {
      ...context,
      maxSize: uploadOptions.maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : undefined,
      extensions: extensions.length > 0 ? extensions : undefined,
      multiple: uploadOptions.multiple,
    };
  }

  async resolveUploadPolicy(data: {
    fileScene: keyof IFileSceneRecord;
    size: number;
    mimeType: string;
  }): Promise<IFileUploadPolicyResolved> {
    const policy = await this.resolveUploadUrlPolicy({ fileScene: data.fileScene });
    const mimeType = data.mimeType.toLowerCase();
    if (policy.maxSize && data.size > policy.maxSize) {
      return this.app.throw(403, `file too large: maxSize=${policy.maxSize}`);
    }
    if (policy.mimeTypes?.length && !matchesFileMimeType(mimeType, policy.mimeTypes)) {
      return this.app.throw(403, `unsupported file mimeType: ${mimeType}`);
    }
    return {
      ...policy,
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
