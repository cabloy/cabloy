import type {
  EntityFile,
  IDecoratorFileProviderOptions,
  IFileDeliveryOptions,
  IFileDownloadResult,
  IFileProviderClientOptions,
  IFileProviderClientRecord,
  IFileProviderExecute,
  IFileProviderResource,
  IFileUploadInput,
} from 'vona-module-a-file';

import fse from 'fs-extra';
import { BeanBase } from 'vona';
import { FileProvider } from 'vona-module-a-file';

export interface IFileProviderNativeClientRecord extends IFileProviderClientRecord {}

export interface IFileProviderNativeClientOptions extends IFileProviderClientOptions {
  subdir?: string;
}

export interface IFileProviderOptionsNative extends IDecoratorFileProviderOptions<
  IFileProviderNativeClientRecord,
  IFileProviderNativeClientOptions
> {}

@FileProvider<IFileProviderOptionsNative>({
  base: {
    subdir: 'default',
    signedDeliveryKind: 'proxy',
    public: false,
  },
})
export class FileProviderNative
  extends BeanBase
  implements IFileProviderExecute<IFileProviderNativeClientOptions, IFileProviderOptionsNative>
{
  async upload(
    input: IFileUploadInput,
    clientOptions: IFileProviderNativeClientOptions,
    _options: IFileProviderOptionsNative,
  ): Promise<IFileProviderResource> {
    const resource = await this.scope.service.fileNative.upload(input, clientOptions);
    return {
      ...resource,
      filename: input.filename,
      contentType: input.contentType,
      meta: input.meta,
    };
  }

  async get(
    file: EntityFile,
    clientOptions: IFileProviderNativeClientOptions,
    _options: IFileProviderOptionsNative,
  ) {
    return {
      resourceId: file.resourceId,
      bucket: file.bucket,
      objectKey: file.objectKey,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      etag: file.etag,
      public: file.public ?? clientOptions.public,
      meta: file.meta,
      storagePath: file.storagePath,
      deliveryBaseUrl: file.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    };
  }

  async delete(
    file: EntityFile,
    _clientOptions: IFileProviderNativeClientOptions,
    _options: IFileProviderOptionsNative,
  ) {
    await this.scope.service.fileNative.remove(file);
  }

  async getDownloadUrl(
    file: EntityFile,
    clientOptions: IFileProviderNativeClientOptions,
    _options: IFileProviderOptionsNative,
    deliveryOptions?: IFileDeliveryOptions,
  ) {
    return await this.scope.service.fileNative.getDownloadUrl(
      file,
      {
        ...clientOptions,
        subdir: clientOptions.subdir ?? 'default',
        deliveryBaseUrl: file.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
        public: file.public ?? clientOptions.public,
      },
      deliveryOptions,
    );
  }

  async download(
    file: EntityFile,
    clientOptions: IFileProviderNativeClientOptions,
    options: IFileProviderOptionsNative,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<IFileDownloadResult> {
    if ((deliveryOptions?.responseMode ?? 'auto') !== 'url' && !deliveryOptions?.signed) {
      const buffer = file.storagePath ? await fse.readFile(file.storagePath) : undefined;
      if (buffer) {
        return {
          kind: 'buffer',
          buffer,
          filename: file.filename,
          contentType: file.contentType,
          signed: false,
        };
      }
    }
    return {
      kind: 'url',
      url: await this.getDownloadUrl(file, clientOptions, options, deliveryOptions),
      filename: file.filename,
      contentType: file.contentType,
      signed: !!deliveryOptions?.signed,
    };
  }
}
