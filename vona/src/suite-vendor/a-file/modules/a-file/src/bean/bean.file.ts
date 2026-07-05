import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityFile } from '../entity/file.ts';
import type {
  IFileDeliveryOptions,
  IFileDirectUploadInput,
  IFileDirectUploadResult,
  IFileProviderDirectUploadResource,
  IFileProviderResource,
  IFileResource,
  IFileUploadContextResolved,
  IFileUploadInput,
  IFileUploadOptions,
  IFileUploadUrlInput,
} from '../types/file.ts';
import type {
  IDecoratorFileProviderOptions,
  IFileProviderClientOptions,
  IFileProviderExecute,
  IFileProviderRecord,
} from '../types/fileProvider.ts';

interface IFileProviderContext {
  beanFileProvider: IFileProviderExecute;
  clientOptions: IFileProviderClientOptions;
  onionOptions: IDecoratorFileProviderOptions;
}

@Bean()
export class BeanFile extends BeanBase {
  async upload<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileUploadInput,
    options?: IFileUploadOptions,
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
      },
    );
    return this._combineFileResource(file, fileProviderResource);
  }

  async uploadUrl<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileUploadUrlInput,
    options?: IFileUploadOptions,
  ): Promise<IFileResource> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanFileProvider.uploadUrl) {
      throw new Error(`File provider does not support uploadUrl: ${String(providerName)}`);
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
      },
    );
    return this._combineFileResource(file, fileProviderResource);
  }

  async createDirectUpload<N extends keyof IFileProviderRecord>(
    providerName: N,
    input: IFileDirectUploadInput,
    options?: IFileUploadOptions,
  ): Promise<IFileDirectUploadResult> {
    const providerContext = await this._getProviderContextByInput(providerName, options);
    if (!providerContext.beanFileProvider.createDirectUpload) {
      throw new Error(`File provider does not support createDirectUpload: ${String(providerName)}`);
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
      },
    );
    return {
      ...this._combineFileResource(file, fileProviderResource),
      uploadUrl: fileProviderResource.uploadUrl,
      headers: fileProviderResource.headers,
      method: fileProviderResource.method,
      draft: fileProviderResource.draft,
    };
  }

  async get(fileId: TableIdentity): Promise<IFileResource | undefined> {
    const file = await this.scope.model.file.getById(fileId);
    if (!file) return;
    const fileProviderResource = await this._getFileProviderResource(file);
    return this._combineFileResource(file, fileProviderResource);
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

  private async _getFileProviderResource(file: EntityFile) {
    const { beanFileProvider, clientOptions, onionOptions } = await this._getProviderContext(file);
    return await beanFileProvider.get(file, clientOptions, onionOptions);
  }

  private async _getProviderContext(file: EntityFile): Promise<IFileProviderContext> {
    const providerContext = await this.bean.fileProvider.getClientOptions({
      providerName: file.providerName,
      clientName: file.clientName,
    });
    if (!providerContext.entityFileProvider) {
      throw new Error(`File provider not found: ${String(file.providerName)}.${file.clientName}`);
    }
    return {
      beanFileProvider: this._getBeanFileProvider(
        providerContext.beanFullName as keyof IFileProviderRecord,
      ),
      clientOptions: this._normalizeClientOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOnionOptions(providerContext.onionOptions),
    };
  }

  private async _getProviderContextByInput<N extends keyof IFileProviderRecord>(
    providerName: N,
    options?: IFileUploadOptions,
  ) {
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
      beanFileProvider: this._getBeanFileProvider(
        providerContext.beanFullName as keyof IFileProviderRecord,
      ),
      clientOptions: this._normalizeClientOptions(providerContext.clientOptions),
      onionOptions: this._normalizeOnionOptions(providerContext.onionOptions),
    };
  }

  private _getBeanFileProvider(beanFullName: keyof IFileProviderRecord): IFileProviderExecute {
    return this.app.bean._getBean<IFileProviderExecute>(beanFullName as never);
  }

  private _normalizeClientOptions(
    clientOptions: IFileProviderClientOptions | undefined,
  ): IFileProviderClientOptions {
    return clientOptions ?? {};
  }

  private _normalizeOnionOptions(
    onionOptions: IDecoratorFileProviderOptions | undefined,
  ): IDecoratorFileProviderOptions {
    return onionOptions ?? {};
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

  private async _insertFile(
    providerName: keyof IFileProviderRecord,
    clientName: string,
    fileProviderResource: IFileProviderResource | IFileProviderDirectUploadResource,
    context?: Partial<IFileUploadContextResolved>,
  ) {
    return await this.scope.model.file.insert({
      providerName,
      clientName,
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
