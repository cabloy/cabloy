import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** Image_uploadBase64 */
export const ApiApiImageuploadBase64Path = '/api/image/upload-base64';
export type ApiApiImageuploadBase64Path = '/api/image/upload-base64';
export type ApiApiImageuploadBase64Method = 'post';
export type ApiApiImageuploadBase64RequestBody =
  components['schemas']['a-image.dto.imageUploadBase64Request'];
export type ApiApiImageuploadBase64ResponseBody =
  paths[ApiApiImageuploadBase64Path][ApiApiImageuploadBase64Method]['responses']['200']['content']['application/json']['data'];

/** Image_getUploadPolicy */
export const ApiApiImagegetUploadPolicyPath = '/api/image/upload-policy';
export type ApiApiImagegetUploadPolicyPath = '/api/image/upload-policy';
export type ApiApiImagegetUploadPolicyMethod = 'post';
export type ApiApiImagegetUploadPolicyRequestBody =
  components['schemas']['a-image.dto.imageUploadPolicyRequest'];
export type ApiApiImagegetUploadPolicyResponseBody =
  paths[ApiApiImagegetUploadPolicyPath][ApiApiImagegetUploadPolicyMethod]['responses']['200']['content']['application/json']['data'];

/** Image_upload */
export const ApiApiImageuploadPath = '/api/image/upload';
export type ApiApiImageuploadPath = '/api/image/upload';
export type ApiApiImageuploadMethod = 'post';
export type ApiApiImageuploadRequestBody = {
  imageScene: string;
  /** Format: binary */
  image: Blob;
};
export type ApiApiImageuploadResponseBody =
  paths[ApiApiImageuploadPath][ApiApiImageuploadMethod]['responses']['200']['content']['application/json']['data'];

/** Image_createDirectUpload */
export const ApiApiImagecreateDirectUploadPath = '/api/image/direct-upload';
export type ApiApiImagecreateDirectUploadPath = '/api/image/direct-upload';
export type ApiApiImagecreateDirectUploadMethod = 'post';
export type ApiApiImagecreateDirectUploadRequestBody =
  components['schemas']['a-image.dto.imageDirectUploadRequest'];
export type ApiApiImagecreateDirectUploadResponseBody =
  paths[ApiApiImagecreateDirectUploadPath][ApiApiImagecreateDirectUploadMethod]['responses']['200']['content']['application/json']['data'];

/** Image_finalizeDirectUpload */
export const ApiApiImagefinalizeDirectUploadPath = '/api/image/direct-upload/finalize';
export type ApiApiImagefinalizeDirectUploadPath = '/api/image/direct-upload/finalize';
export type ApiApiImagefinalizeDirectUploadMethod = 'post';
export type ApiApiImagefinalizeDirectUploadRequestBody =
  components['schemas']['a-image.dto.imageDirectUploadFinalizeRequest'];
export type ApiApiImagefinalizeDirectUploadResponseBody =
  paths[ApiApiImagefinalizeDirectUploadPath][ApiApiImagefinalizeDirectUploadMethod]['responses']['200']['content']['application/json']['data'];

/** Image_uploadUrl */
export const ApiApiImageuploadUrlPath = '/api/image/upload-url';
export type ApiApiImageuploadUrlPath = '/api/image/upload-url';
export type ApiApiImageuploadUrlMethod = 'post';
export type ApiApiImageuploadUrlRequestBody =
  components['schemas']['a-image.dto.imageUploadUrlRequest'];
export type ApiApiImageuploadUrlResponseBody =
  paths[ApiApiImageuploadUrlPath][ApiApiImageuploadUrlMethod]['responses']['200']['content']['application/json']['data'];

/** Image_delivery */
export const ApiApiImagedeliveryPath = '/api/image/delivery';
export type ApiApiImagedeliveryPath = '/api/image/delivery';
export type ApiApiImagedeliveryMethod = 'get';
export type ApiApiImagedeliveryRequestQuery =
  paths[ApiApiImagedeliveryPath][ApiApiImagedeliveryMethod]['parameters']['query'];
export type ApiApiImagedeliveryResponseBody =
  paths[ApiApiImagedeliveryPath][ApiApiImagedeliveryMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiImage extends BeanApiBase {
  /** Upload image content */
  uploadBase64(body: ApiApiImageuploadBase64RequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImageuploadBase64ResponseBody>(
      ApiApiImageuploadBase64Path,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  /** Get image upload policy */
  getUploadPolicy(body: ApiApiImagegetUploadPolicyRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImagegetUploadPolicyResponseBody>(
      ApiApiImagegetUploadPolicyPath,
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

  createDirectUpload(body: ApiApiImagecreateDirectUploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImagecreateDirectUploadResponseBody>(
      ApiApiImagecreateDirectUploadPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  finalizeDirectUpload(
    body: ApiApiImagefinalizeDirectUploadRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiImagefinalizeDirectUploadResponseBody>(
      ApiApiImagefinalizeDirectUploadPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  uploadUrl(body: ApiApiImageuploadUrlRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiImageuploadUrlResponseBody>(
      ApiApiImageuploadUrlPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delivery(
    options: {
      query: ApiApiImagedeliveryRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiImagedeliveryResponseBody>(
      ApiApiImagedeliveryPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
