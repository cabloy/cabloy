import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

export type IImageTransformOptions = NonNullable<
  NonNullable<components['schemas']['a-image.dto.imageUploadResponse']['variants']>[string]
>;

/** Image_createUploadToken */
export const ApiApiImagecreateUploadTokenPath = '/api/image/upload-token';
export type ApiApiImagecreateUploadTokenPath = '/api/image/upload-token';
export type ApiApiImagecreateUploadTokenMethod = 'post';
export type ApiApiImagecreateUploadTokenRequestBody =
  components['schemas']['a-image.dto.imageUploadTokenRequest'];
export type ApiApiImagecreateUploadTokenResponseBody =
  paths[ApiApiImagecreateUploadTokenPath][ApiApiImagecreateUploadTokenMethod]['responses']['200']['content']['application/json']['data'];

/** Image_upload */
export const ApiApiImageuploadPath = '/api/image/upload';
export type ApiApiImageuploadPath = '/api/image/upload';
export type ApiApiImageuploadMethod = 'post';
export type ApiApiImageuploadRequestBody = {
  token: string;
  /** Format: binary */
  image: Blob;
};
export type ApiApiImageuploadResponseBody =
  paths[ApiApiImageuploadPath][ApiApiImageuploadMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiImage extends BeanApiBase {
  createUploadToken(body: ApiApiImagecreateUploadTokenRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImagecreateUploadTokenResponseBody>(
      ApiApiImagecreateUploadTokenPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  upload(body: ApiApiImageuploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImageuploadResponseBody>(
      ApiApiImageuploadPath,
      this.$formData(body),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
