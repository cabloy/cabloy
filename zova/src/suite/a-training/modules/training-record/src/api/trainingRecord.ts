import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** TrainingRecord_select */
export const ApiApiTrainingRecordselectPath = '/api/training/record';
export type ApiApiTrainingRecordselectPath = '/api/training/record';
export type ApiApiTrainingRecordselectMethod = 'get';
export type ApiApiTrainingRecordselectRequestQuery =
  paths[ApiApiTrainingRecordselectPath][ApiApiTrainingRecordselectMethod]['parameters']['query'];
export type ApiApiTrainingRecordselectResponseBody =
  paths[ApiApiTrainingRecordselectPath][ApiApiTrainingRecordselectMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingRecord_create */
export const ApiApiTrainingRecordcreatePath = '/api/training/record';
export type ApiApiTrainingRecordcreatePath = '/api/training/record';
export type ApiApiTrainingRecordcreateMethod = 'post';
export type ApiApiTrainingRecordcreateRequestBody =
  components['schemas']['training-record.dto.recordCreate'];
export type ApiApiTrainingRecordcreateResponseBody =
  paths[ApiApiTrainingRecordcreatePath][ApiApiTrainingRecordcreateMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingRecord_view */
export const ApiApiTrainingRecordviewPath = '/api/training/record/{id}';
export type ApiApiTrainingRecordviewPath = '/api/training/record/{id}';
export type ApiApiTrainingRecordviewMethod = 'get';
export type ApiApiTrainingRecordviewRequestParams =
  paths[ApiApiTrainingRecordviewPath][ApiApiTrainingRecordviewMethod]['parameters']['path'];
export type ApiApiTrainingRecordviewResponseBody =
  paths[ApiApiTrainingRecordviewPath][ApiApiTrainingRecordviewMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingRecord_delete */
export const ApiApiTrainingRecorddeletePath = '/api/training/record/{id}';
export type ApiApiTrainingRecorddeletePath = '/api/training/record/{id}';
export type ApiApiTrainingRecorddeleteMethod = 'delete';
export type ApiApiTrainingRecorddeleteRequestParams =
  paths[ApiApiTrainingRecorddeletePath][ApiApiTrainingRecorddeleteMethod]['parameters']['path'];
export type ApiApiTrainingRecorddeleteResponseBody =
  paths[ApiApiTrainingRecorddeletePath][ApiApiTrainingRecorddeleteMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingRecord_update */
export const ApiApiTrainingRecordupdatePath = '/api/training/record/{id}';
export type ApiApiTrainingRecordupdatePath = '/api/training/record/{id}';
export type ApiApiTrainingRecordupdateMethod = 'patch';
export type ApiApiTrainingRecordupdateRequestParams =
  paths[ApiApiTrainingRecordupdatePath][ApiApiTrainingRecordupdateMethod]['parameters']['path'];
export type ApiApiTrainingRecordupdateRequestBody =
  components['schemas']['training-record.dto.recordUpdate'];
export type ApiApiTrainingRecordupdateResponseBody =
  paths[ApiApiTrainingRecordupdatePath][ApiApiTrainingRecordupdateMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiTrainingRecord extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiTrainingRecordselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTrainingRecordselectResponseBody>(
      ApiApiTrainingRecordselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiTrainingRecordcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiTrainingRecordcreateResponseBody>(
      ApiApiTrainingRecordcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiTrainingRecordviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTrainingRecordviewResponseBody>(
      this.$pathTranslate(ApiApiTrainingRecordviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiTrainingRecorddeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiTrainingRecorddeleteResponseBody>(
      this.$pathTranslate(ApiApiTrainingRecorddeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiTrainingRecordupdateRequestBody,
    options: {
      params: ApiApiTrainingRecordupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiTrainingRecordupdateResponseBody>(
      this.$pathTranslate(ApiApiTrainingRecordupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
