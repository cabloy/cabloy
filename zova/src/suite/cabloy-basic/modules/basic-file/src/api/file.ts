import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** File_getUploadPolicy */
export const ApiApiFilegetUploadPolicyPath = '/api/file/upload-policy';
export type ApiApiFilegetUploadPolicyPath = '/api/file/upload-policy';
export type ApiApiFilegetUploadPolicyMethod = 'post';
export type ApiApiFilegetUploadPolicyRequestBody =
  components['schemas']['a-file.dto.fileUploadPolicyRequest'];
export type ApiApiFilegetUploadPolicyResponseBody =
  paths[ApiApiFilegetUploadPolicyPath][ApiApiFilegetUploadPolicyMethod]['responses']['200']['content']['application/json']['data'];

/** File_upload */
export const ApiApiFileuploadPath = '/api/file/upload';
export type ApiApiFileuploadPath = '/api/file/upload';
export type ApiApiFileuploadMethod = 'post';
export type ApiApiFileuploadRequestBody = {
  fileScene: string;
  /** Format: binary */
  file: Blob;
};
export type ApiApiFileuploadResponseBody =
  paths[ApiApiFileuploadPath][ApiApiFileuploadMethod]['responses']['200']['content']['application/json']['data'];

/** File_createDirectUpload */
export const ApiApiFilecreateDirectUploadPath = '/api/file/direct-upload';
export type ApiApiFilecreateDirectUploadPath = '/api/file/direct-upload';
export type ApiApiFilecreateDirectUploadMethod = 'post';
export type ApiApiFilecreateDirectUploadRequestBody =
  components['schemas']['a-file.dto.fileDirectUploadRequest'];
export type ApiApiFilecreateDirectUploadResponseBody =
  paths[ApiApiFilecreateDirectUploadPath][ApiApiFilecreateDirectUploadMethod]['responses']['200']['content']['application/json']['data'];

/** File_finalizeDirectUpload */
export const ApiApiFilefinalizeDirectUploadPath = '/api/file/direct-upload/finalize';
export type ApiApiFilefinalizeDirectUploadPath = '/api/file/direct-upload/finalize';
export type ApiApiFilefinalizeDirectUploadMethod = 'post';
export type ApiApiFilefinalizeDirectUploadRequestBody =
  components['schemas']['a-file.dto.fileDirectUploadFinalizeRequest'];
export type ApiApiFilefinalizeDirectUploadResponseBody =
  paths[ApiApiFilefinalizeDirectUploadPath][ApiApiFilefinalizeDirectUploadMethod]['responses']['200']['content']['application/json']['data'];

/** File_uploadUrl */
export const ApiApiFileuploadUrlPath = '/api/file/upload-url';
export type ApiApiFileuploadUrlPath = '/api/file/upload-url';
export type ApiApiFileuploadUrlMethod = 'post';
export type ApiApiFileuploadUrlRequestBody =
  components['schemas']['a-file.dto.fileUploadUrlRequest'];
export type ApiApiFileuploadUrlResponseBody =
  paths[ApiApiFileuploadUrlPath][ApiApiFileuploadUrlMethod]['responses']['200']['content']['application/json']['data'];

/** File_download */
export const ApiApiFiledownloadPath = '/api/file/download';
export type ApiApiFiledownloadPath = '/api/file/download';
export type ApiApiFiledownloadMethod = 'get';
export type ApiApiFiledownloadRequestQuery =
  paths[ApiApiFiledownloadPath][ApiApiFiledownloadMethod]['parameters']['query'];
export type ApiApiFiledownloadResponseBody =
  paths[ApiApiFiledownloadPath][ApiApiFiledownloadMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiFile extends BeanApiBase {
  getUploadPolicy(body: ApiApiFilegetUploadPolicyRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFilegetUploadPolicyResponseBody>(
      ApiApiFilegetUploadPolicyPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  upload(body: ApiApiFileuploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFileuploadResponseBody>(
      ApiApiFileuploadPath,
      this.$formData(body),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  createDirectUpload(body: ApiApiFilecreateDirectUploadRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFilecreateDirectUploadResponseBody>(
      ApiApiFilecreateDirectUploadPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  finalizeDirectUpload(
    body: ApiApiFilefinalizeDirectUploadRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiFilefinalizeDirectUploadResponseBody>(
      ApiApiFilefinalizeDirectUploadPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  uploadUrl(body: ApiApiFileuploadUrlRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiFileuploadUrlResponseBody>(
      ApiApiFileuploadUrlPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  download(
    options: {
      query: ApiApiFiledownloadRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiFiledownloadResponseBody>(
      ApiApiFiledownloadPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
