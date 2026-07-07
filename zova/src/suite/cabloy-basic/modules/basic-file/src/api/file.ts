import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

export interface ApiApiFilecreateUploadTokenRequestBody {
  fileScene: string;
  size: number;
  mimeType: string;
  expiresIn?: number;
}

export interface ApiApiFilecreateUploadTokenResponseBody {
  token: string;
  expiresIn?: number;
}

export interface ApiApiFileuploadRequestBody {
  token: string;
  file: Blob;
}

export interface ApiApiFileuploadResponseBody {
  id: string | number;
  provider: string;
  clientName: string;
  resourceId: string;
  bucket?: string;
  objectKey?: string;
  filename?: string;
  contentType?: string;
  size?: number;
  etag?: string;
  public?: boolean;
  fileScene?: string;
  uploadedAt?: string | Date;
  url?: string;
  signed?: boolean;
}

@Api()
export class ApiFile extends BeanApiBase {
  createUploadToken(body: ApiApiFilecreateUploadTokenRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFilecreateUploadTokenResponseBody>(
      '/api/file/upload-token',
      body,
      this.$configPrepare(undefined, options, true),
    );
  }

  upload(body: ApiApiFileuploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFileuploadResponseBody>(
      '/api/file/upload',
      this.$formData(body),
      this.$configPrepare(undefined, options, true),
    );
  }
}
