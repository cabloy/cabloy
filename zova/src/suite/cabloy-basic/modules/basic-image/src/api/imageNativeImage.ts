import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** ImageNativeImage_directUpload */
export const ApiApiImageNativeImagedirectUploadPath =
  '/api/image/native/image-native/direct-upload/{resourceId}';
export type ApiApiImageNativeImagedirectUploadPath =
  '/api/image/native/image-native/direct-upload/{resourceId}';
export type ApiApiImageNativeImagedirectUploadMethod = 'post';
export type ApiApiImageNativeImagedirectUploadRequestBody = {
  /** Format: binary */
  image: Blob;
};
export type ApiApiImageNativeImagedirectUploadResponseBody =
  paths[ApiApiImageNativeImagedirectUploadPath][ApiApiImageNativeImagedirectUploadMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiImageNativeImage extends BeanApiBase {
  directUpload(body: ApiApiImageNativeImagedirectUploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImageNativeImagedirectUploadResponseBody>(
      ApiApiImageNativeImagedirectUploadPath,
      this.$formData(body),
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
