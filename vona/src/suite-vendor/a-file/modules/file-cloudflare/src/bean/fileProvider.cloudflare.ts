import type {
  EntityFile,
  IDecoratorFileProviderOptions,
  IFileDeliveryOptions,
  IFileDirectUploadInput,
  IFileDownloadResult,
  IFileProviderClientOptions,
  IFileProviderClientRecord,
  IFileProviderExecute,
  IFileProviderResource,
  IFileUploadInput,
  IFileUploadUrlInput,
} from 'vona-module-a-file';

import { BeanBase } from 'vona';
import { FileProvider } from 'vona-module-a-file';

export interface IFileProviderCloudflareClientRecord extends IFileProviderClientRecord {}

export interface IFileProviderCloudflareClientOptions extends IFileProviderClientOptions {
  endpoint?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle?: boolean;
}

export interface IFileProviderOptionsCloudflare extends IDecoratorFileProviderOptions<
  IFileProviderCloudflareClientRecord,
  IFileProviderCloudflareClientOptions
> {}

@FileProvider<IFileProviderOptionsCloudflare>({
  base: {
    signedDeliveryKind: 'provider',
    public: false,
    region: 'auto',
  },
})
export class FileProviderCloudflare
  extends BeanBase
  implements
    IFileProviderExecute<IFileProviderCloudflareClientOptions, IFileProviderOptionsCloudflare>
{
  async upload(
    input: IFileUploadInput,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
  ): Promise<IFileProviderResource> {
    return await this.scope.service.fileCloudflare.upload(input, clientOptions);
  }

  async uploadUrl(
    input: IFileUploadUrlInput,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
  ) {
    return await this.scope.service.fileCloudflare.uploadUrl(input, clientOptions);
  }

  async createDirectUpload(
    input: IFileDirectUploadInput,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
  ) {
    return await this.scope.service.fileCloudflare.createDirectUpload(input, clientOptions);
  }

  async get(
    file: EntityFile,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
  ) {
    return {
      resourceId: file.resourceId,
      bucket: file.bucket ?? clientOptions.bucket,
      objectKey: file.objectKey,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      etag: file.etag,
      public: file.public ?? clientOptions.public,
      meta: file.meta,
      deliveryBaseUrl: file.deliveryBaseUrl ?? clientOptions.deliveryBaseUrl,
    };
  }

  async delete(
    file: EntityFile,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
  ) {
    await this.scope.service.fileCloudflare.remove(file, clientOptions);
  }

  async getDownloadUrl(
    file: EntityFile,
    clientOptions: IFileProviderCloudflareClientOptions,
    _options: IFileProviderOptionsCloudflare,
    deliveryOptions?: IFileDeliveryOptions,
  ) {
    return await this.scope.service.fileCloudflare.getDownloadUrl(
      file,
      clientOptions,
      deliveryOptions,
    );
  }

  async download(
    file: EntityFile,
    clientOptions: IFileProviderCloudflareClientOptions,
    options: IFileProviderOptionsCloudflare,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<IFileDownloadResult> {
    return {
      kind: 'url',
      url: await this.getDownloadUrl(file, clientOptions, options, deliveryOptions),
      filename: file.filename,
      contentType: file.contentType,
      signed: !!(deliveryOptions?.signed ?? !(file.public ?? clientOptions.public)),
    };
  }
}
