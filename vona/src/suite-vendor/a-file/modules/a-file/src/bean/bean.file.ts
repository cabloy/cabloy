import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityFile } from '../entity/file.ts';
import type {
  IFileActionResponse,
  IFileDeliveryOptions,
  IFileDirectUploadInput,
  IFileDirectUploadResponse,
  IFileProviderDirectUploadResource,
  IFileProviderResource,
  IFileResource,
  IFileUploadInput,
  IFileUploadOptions,
  IFileUploadUrlInput,
  IFileView,
} from '../types/file.ts';
import type {
  IFileProviderRecord,
  TypeFileProviderClientOptionsByName,
  TypeFileProviderExecuteByName,
  TypeFileProviderOptionsByName,
} from '../types/fileProvider.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

interface IFileProviderContext<N extends keyof IFileProviderRecord = keyof IFileProviderRecord> {
  beanFileProvider: TypeFileProviderExecuteByName<N>;
  clientOptions: TypeFileProviderClientOptionsByName<N>;
  onionOptions: TypeFileProviderOptionsByName<N>;
}

interface IInsertFileContext {
  fileScene?: keyof IFileSceneRecord;
  public?: boolean;
  status?: EntityFile['status'];
  draftExpiresAt?: Date;
  finalizedAt?: Date;
}

@Bean()
export class BeanFile extends BeanBase {
  async upload<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileUploadInput,
    options?: IFileUploadOptions<TypeFileProviderClientOptionsByName<N>>,
  ): Promise<IFileResource> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    const fileProviderResource = await providerContext.beanFileProvider.upload(
      { ...input, public: options?.public ?? input.public, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const file = await this._insertFile(
      providerName,
      providerContext.clientName,
      fileProviderResource,
      {
        fileScene: options?.fileScene,
        public: options?.public ?? input.public,
        status: 'ready',
      },
    );
    return this._combineFileResource(file, fileProviderResource);
  }

  async uploadUrl<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileUploadUrlInput,
    options?: IFileUploadOptions<TypeFileProviderClientOptionsByName<N>>,
  ): Promise<IFileResource> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanFileProvider.uploadUrl) {
      return this.app.throw(
        403,
        `File provider does not support uploadUrl: ${String(providerName)}`,
      );
    }
    const fileProviderResource = await providerContext.beanFileProvider.uploadUrl(
      { ...input, public: options?.public ?? input.public, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const file = await this._insertFile(
      providerName,
      providerContext.clientName,
      fileProviderResource,
      {
        fileScene: options?.fileScene,
        public: options?.public ?? input.public,
        status: 'ready',
      },
    );
    return this._combineFileResource(file, fileProviderResource);
  }

  async createDirectUpload<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileDirectUploadInput,
    options?: IFileUploadOptions<TypeFileProviderClientOptionsByName<N>>,
  ): Promise<IFileDirectUploadResponse> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (
      !providerContext.beanFileProvider.createDirectUpload ||
      !providerContext.beanFileProvider.finalizeDirectUpload
    ) {
      return this.app.throw(
        403,
        `File provider does not support createDirectUpload: ${String(providerName)}`,
      );
    }
    const fileProviderResource = await providerContext.beanFileProvider.createDirectUpload(
      { ...input, public: options?.public ?? input.public, meta: options?.meta ?? input.meta },
      providerContext.clientOptions,
      providerContext.onionOptions,
    );
    const file = await this._insertFile(
      providerName,
      providerContext.clientName,
      fileProviderResource,
      {
        fileScene: options?.fileScene,
        public: options?.public ?? input.public,
        status: 'draft',
        draftExpiresAt: this._resolveDirectUploadDraftExpiresAt(input.expiry),
      },
    );
    return this._createDirectUploadResponse(file, fileProviderResource);
  }

  async finalizeDirectUpload(fileId: TableIdentity): Promise<IFileResource> {
    return await this.scope.redlock.lock(`file.directUpload.${fileId}`, async () => {
      const file = await this.scope.model.file.getById(fileId);
      if (!file) throw new Error(`not found file: ${fileId}`);
      if (file.status !== 'draft') {
        return this.app.throw(403, `file is not draft: ${fileId}`);
      }
      const draftExpiresAt = this._normalizeDate(file.draftExpiresAt);
      if (draftExpiresAt && draftExpiresAt.getTime() < Date.now()) {
        await this.scope.model.file.updateById(file.id, { status: 'expired' });
        return this.app.throw(403, `file draft expired: ${fileId}`);
      }
      const providerContext = await this._getProviderContext(file);
      if (!providerContext.beanFileProvider.finalizeDirectUpload) {
        return this.app.throw(
          403,
          `File provider does not support finalizeDirectUpload: ${String(file.providerName)}`,
        );
      }
      const fileProviderResource = await providerContext.beanFileProvider.finalizeDirectUpload(
        file,
        providerContext.clientOptions,
        providerContext.onionOptions,
      );
      if (!fileProviderResource) {
        return this.app.throw(403, `file direct upload not ready: ${fileId}`);
      }
      const finalizedAt = new Date();
      const fileUpdated = await this.scope.model.file.updateById(
        file.id,
        this._buildFilePersistData(fileProviderResource, {
          fileScene: file.fileScene,
          public: file.public,
          status: 'ready',
          draftExpiresAt,
          finalizedAt,
        }),
      );
      return this._combineFileResource({ ...file, ...fileUpdated }, fileProviderResource);
    });
  }

  async get(fileId: TableIdentity): Promise<IFileResource | undefined> {
    const file = await this.scope.model.file.getById(fileId);
    if (!file) return;
    const fileProviderResource = await this._getFileProviderResource(file);
    return this._combineFileResource(file, fileProviderResource);
  }

  async expireDraftFile(fileId: TableIdentity) {
    return await this.scope.redlock.lock(`file.directUpload.${fileId}`, async () => {
      const file = await this.scope.model.file.getById(fileId);
      if (!file || file.status !== 'draft') return;
      const draftExpiresAt = this._normalizeDate(file.draftExpiresAt);
      if (!draftExpiresAt || draftExpiresAt.getTime() >= Date.now()) return;
      const { beanFileProvider, clientOptions, onionOptions } =
        await this._getProviderContext(file);
      await beanFileProvider.delete(file, clientOptions, onionOptions);
      await this.scope.model.file.updateById(file.id, { status: 'expired' });
    });
  }

  async delete(fileId: TableIdentity) {
    const file = await this.scope.model.file.getById(fileId);
    if (!file) return;
    const { beanFileProvider, clientOptions, onionOptions } = await this._getProviderContext(file);
    await beanFileProvider.delete(file, clientOptions, onionOptions);
    await this.scope.model.file.deleteById(file.id);
  }

  async getDownloadUrl(fileId: TableIdentity, deliveryOptions?: IFileDeliveryOptions) {
    const file = await this.scope.model.file.getById(fileId);
    if (!file) throw new Error(`not found file: ${fileId}`);
    this._assertFileReady(file);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(file, deliveryOptions);
    const { beanFileProvider, clientOptions, onionOptions } = await this._getProviderContext(file);
    if (
      deliveryOptionsResolved.signed &&
      (clientOptions.signedDeliveryKind ?? 'proxy') === 'proxy'
    ) {
      return await this._createSignedDownloadUrl(file.id, deliveryOptionsResolved);
    }
    return await beanFileProvider.getDownloadUrl(
      file,
      clientOptions,
      onionOptions,
      deliveryOptionsResolved,
    );
  }

  async download(fileId: TableIdentity, deliveryOptions?: IFileDeliveryOptions) {
    const file = await this.scope.model.file.getById(fileId);
    if (!file) throw new Error(`not found file: ${fileId}`);
    this._assertFileReady(file);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(file, deliveryOptions);
    const { beanFileProvider, clientOptions, onionOptions } = await this._getProviderContext(file);
    if (
      deliveryOptionsResolved.signed &&
      (clientOptions.signedDeliveryKind ?? 'proxy') === 'proxy'
    ) {
      return {
        kind: 'url' as const,
        url: await this._createSignedDownloadUrl(file.id, deliveryOptionsResolved),
        filename: file.filename,
        contentType: file.contentType,
        signed: true,
      };
    }
    if (beanFileProvider.download) {
      return await beanFileProvider.download(
        file,
        clientOptions,
        onionOptions,
        deliveryOptionsResolved,
      );
    }
    return {
      kind: 'url' as const,
      url: await beanFileProvider.getDownloadUrl(
        file,
        clientOptions,
        onionOptions,
        deliveryOptionsResolved,
      ),
      filename: file.filename,
      contentType: file.contentType,
      signed: !!deliveryOptionsResolved.signed,
    };
  }

  async resolveView(
    fileId?: TableIdentity,
    fileScene?: keyof IFileSceneRecord,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<IFileView | undefined> {
    if (!fileId) return;
    const file = await this.get(fileId);
    if (!file) return;
    this._assertFileReady(file);
    if (fileScene && file.fileScene !== fileScene) {
      throw new Error(`file scene mismatch: file=${file.fileScene}, expected=${fileScene}`);
    }
    return await this._createFileView(file, deliveryOptions);
  }

  async resolveViews(
    fileIds?: TableIdentity[],
    fileScene?: keyof IFileSceneRecord,
    deliveryOptions?: IFileDeliveryOptions,
  ) {
    if (!fileIds) return;
    if (!fileIds.length) return [];
    const items = await Promise.all(
      fileIds.map(fileId => this.resolveView(fileId, fileScene, deliveryOptions)),
    );
    return items.filter((item): item is IFileView => !!item);
  }

  async createFileActionResponse(
    file: IFileResource,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<IFileActionResponse> {
    this._assertFileReady(file);
    const deliveryOptionsResolved = this._mergeDeliveryOptions(file, deliveryOptions);
    return {
      id: file.id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      public: file.public,
      uploadedAt: file.uploadedAt,
      url: await this.getDownloadUrl(file.id, deliveryOptions),
      signed: !!deliveryOptionsResolved.signed,
    } satisfies IFileActionResponse;
  }

  private async _getFileProviderResource(file: EntityFile) {
    const { beanFileProvider, clientOptions, onionOptions } = await this._getProviderContext(file);
    return await beanFileProvider.get(file, clientOptions, onionOptions);
  }

  private async _getProviderContext<N extends keyof IFileProviderRecord>(
    file: EntityFile & { providerName: N },
  ): Promise<IFileProviderContext<N>> {
    const providerContext = await this.bean.fileProvider.getClientOptions({
      providerName: file.providerName,
      clientName: file.clientName,
    });
    if (!providerContext.entityFileProvider) {
      throw new Error(`File provider not found: ${String(file.providerName)}.${file.clientName}`);
    }
    return {
      beanFileProvider: this._getBeanFileProvider(file.providerName, providerContext.beanFullName),
      clientOptions: this._normalizeOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOptions(providerContext.onionOptions),
    };
  }

  private async _getProviderContextByInput<N extends keyof IFileProviderRecord>(
    providerName: N,
    options?: IFileUploadOptions<TypeFileProviderClientOptionsByName<N>>,
  ): Promise<IFileProviderContext<N> & { clientName: string }> {
    const clientName = options?.clientName ?? 'default';
    const providerContext = await this.bean.fileProvider.getClientOptions(
      {
        providerName,
        clientName,
      },
      options?.clientOptions,
    );
    if (!providerContext.entityFileProvider || providerContext.disabled) {
      return this.app.throw(403);
    }
    return {
      clientName,
      beanFileProvider: this._getBeanFileProvider(providerName, providerContext.beanFullName),
      clientOptions: this._normalizeOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOptions(providerContext.onionOptions),
    };
  }

  private _getBeanFileProvider<N extends keyof IFileProviderRecord>(
    _providerName: N,
    beanFullName: string,
  ): TypeFileProviderExecuteByName<N> {
    return this.app.bean._getBean<TypeFileProviderExecuteByName<N>>(beanFullName as never);
  }

  private _normalizeOptions<T extends object>(options: T | undefined): T {
    return (options ?? {}) as T;
  }

  private _mergeDeliveryOptions(
    file: Pick<IFileResource, 'public'>,
    deliveryOptions?: IFileDeliveryOptions,
  ): IFileDeliveryOptions {
    const signed = deliveryOptions?.signed ?? !file.public;
    const expiresIn = deliveryOptions?.expiresIn;
    const expiresAt = deliveryOptions?.expiresAt;
    const responseMode = deliveryOptions?.responseMode;
    return {
      signed,
      expiresIn,
      expiresAt,
      responseMode,
    };
  }

  private async _createSignedDownloadUrl(
    fileId: TableIdentity,
    deliveryOptions: IFileDeliveryOptions,
  ) {
    const routePath = this.scope.util.combineApiPath(`file/download/${fileId}`, false, true);
    const tokenPayload = await this.bean.fileUploadPolicy.createDownloadToken({
      fileId,
      expiresIn: deliveryOptions.expiresIn,
    });
    const routeUrl = this.app.util.getAbsoluteUrlByApiPath(routePath);
    const url = new URL(routeUrl);
    url.searchParams.set('token', tokenPayload.token);
    return url.toString();
  }

  private async _createFileView(file: IFileResource, deliveryOptions?: IFileDeliveryOptions) {
    const deliveryOptionsResolved = this._mergeDeliveryOptions(file, deliveryOptions);
    return {
      id: file.id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      public: file.public,
      uploadedAt: file.uploadedAt,
      downloadUrl: await this.getDownloadUrl(file.id, deliveryOptions),
      signed: !!deliveryOptionsResolved.signed,
    } satisfies IFileView;
  }

  private _createDirectUploadResponse(
    file: EntityFile,
    fileProviderResource: IFileProviderDirectUploadResource,
  ) {
    return {
      id: file.id,
      uploadUrl: fileProviderResource.uploadUrl,
      headers: fileProviderResource.headers,
      method: fileProviderResource.method,
      filename: fileProviderResource.filename,
      public: fileProviderResource.public ?? file.public,
    } satisfies IFileDirectUploadResponse;
  }

  private _resolveDirectUploadDraftExpiresAt(expiry?: IFileDirectUploadInput['expiry']) {
    return (
      this._normalizeDate(expiry) ??
      new Date(Date.now() + this.scope.config.file.directUpload.draftExpiresIn)
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

  private _assertFileReady(file: Pick<IFileResource, 'id' | 'status'>) {
    if (file.status === 'draft') {
      return this.app.throw(403, `file draft not ready: ${file.id}`);
    }
    if (file.status === 'expired') {
      return this.app.throw(403, `file draft expired: ${file.id}`);
    }
  }

  private _buildFilePersistData(
    fileProviderResource: IFileProviderResource | IFileProviderDirectUploadResource,
    context?: IInsertFileContext,
  ) {
    return {
      resourceId: fileProviderResource.resourceId,
      bucket: fileProviderResource.bucket,
      objectKey: fileProviderResource.objectKey,
      filename: fileProviderResource.filename,
      contentType: fileProviderResource.contentType,
      size: fileProviderResource.size,
      etag: fileProviderResource.etag,
      public: fileProviderResource.public ?? context?.public,
      meta: fileProviderResource.meta,
      storagePath: fileProviderResource.storagePath,
      deliveryBaseUrl: fileProviderResource.deliveryBaseUrl,
      fileScene: context?.fileScene,
      status: context?.status,
      draftExpiresAt: context?.draftExpiresAt,
      finalizedAt: context?.finalizedAt,
    };
  }

  private async _insertFile(
    providerName: keyof IFileProviderRecord,
    clientName: string,
    fileProviderResource: IFileProviderResource | IFileProviderDirectUploadResource,
    context?: IInsertFileContext,
  ) {
    return await this.scope.model.file.insert({
      providerName,
      clientName,
      ...this._buildFilePersistData(fileProviderResource, context),
    });
  }

  private _combineFileResource(
    file: EntityFile,
    fileProviderResource?: IFileProviderResource,
  ): IFileResource {
    return {
      id: file.id,
      provider: file.providerName,
      clientName: file.clientName,
      fileScene: file.fileScene,
      status: file.status,
      draftExpiresAt: file.status === 'draft' ? file.draftExpiresAt : undefined,
      finalizedAt: file.finalizedAt,
      resourceId: fileProviderResource?.resourceId ?? file.resourceId,
      bucket: fileProviderResource?.bucket ?? file.bucket,
      objectKey: fileProviderResource?.objectKey ?? file.objectKey,
      filename: fileProviderResource?.filename ?? file.filename,
      contentType: fileProviderResource?.contentType ?? file.contentType,
      size: fileProviderResource?.size ?? file.size,
      etag: fileProviderResource?.etag ?? file.etag,
      public: fileProviderResource?.public ?? file.public,
      meta: fileProviderResource?.meta ?? file.meta,
      storagePath: fileProviderResource?.storagePath ?? file.storagePath,
      deliveryBaseUrl: fileProviderResource?.deliveryBaseUrl ?? file.deliveryBaseUrl,
      raw: fileProviderResource?.raw,
      uploadedAt: file.createdAt,
    };
  }
}
