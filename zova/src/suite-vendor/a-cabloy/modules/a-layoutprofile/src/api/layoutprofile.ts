import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** Layoutprofile_load */
export const ApiApiLayoutprofileloadPath = '/api/layoutprofile/load';
export type ApiApiLayoutprofileloadPath = '/api/layoutprofile/load';
export type ApiApiLayoutprofileloadMethod = 'get';
export type ApiApiLayoutprofileloadRequestQuery =
  paths[ApiApiLayoutprofileloadPath][ApiApiLayoutprofileloadMethod]['parameters']['query'];
export type ApiApiLayoutprofileloadResponseBody =
  paths[ApiApiLayoutprofileloadPath][ApiApiLayoutprofileloadMethod]['responses']['200']['content']['application/json']['data'];

/** Layoutprofile_save */
export const ApiApiLayoutprofilesavePath = '/api/layoutprofile/save';
export type ApiApiLayoutprofilesavePath = '/api/layoutprofile/save';
export type ApiApiLayoutprofilesaveMethod = 'post';
export type ApiApiLayoutprofilesaveRequestBody =
  components['schemas']['a-layoutprofile.dto.layoutProfileSave'];
export type ApiApiLayoutprofilesaveResponseBody =
  paths[ApiApiLayoutprofilesavePath][ApiApiLayoutprofilesaveMethod]['responses']['200']['content']['application/json']['data'];

/** Layoutprofile_reset */
export const ApiApiLayoutprofileresetPath = '/api/layoutprofile/reset';
export type ApiApiLayoutprofileresetPath = '/api/layoutprofile/reset';
export type ApiApiLayoutprofileresetMethod = 'delete';
export type ApiApiLayoutprofileresetRequestQuery =
  paths[ApiApiLayoutprofileresetPath][ApiApiLayoutprofileresetMethod]['parameters']['query'];
export type ApiApiLayoutprofileresetResponseBody =
  paths[ApiApiLayoutprofileresetPath][ApiApiLayoutprofileresetMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiLayoutprofile extends BeanApiBase {
  load(
    options: {
      query: ApiApiLayoutprofileloadRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiLayoutprofileloadResponseBody>(
      ApiApiLayoutprofileloadPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  save(body: ApiApiLayoutprofilesaveRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiLayoutprofilesaveResponseBody>(
      ApiApiLayoutprofilesavePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  reset(
    options: {
      query: ApiApiLayoutprofileresetRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiLayoutprofileresetResponseBody>(
      ApiApiLayoutprofileresetPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
