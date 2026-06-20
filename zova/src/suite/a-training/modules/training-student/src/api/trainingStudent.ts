import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** TrainingStudent_select */
export const ApiApiTrainingStudentselectPath = '/api/training/student';
export type ApiApiTrainingStudentselectPath = '/api/training/student';
export type ApiApiTrainingStudentselectMethod = 'get';
export type ApiApiTrainingStudentselectRequestQuery =
  paths[ApiApiTrainingStudentselectPath][ApiApiTrainingStudentselectMethod]['parameters']['query'];
export type ApiApiTrainingStudentselectResponseBody =
  paths[ApiApiTrainingStudentselectPath][ApiApiTrainingStudentselectMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_create */
export const ApiApiTrainingStudentcreatePath = '/api/training/student';
export type ApiApiTrainingStudentcreatePath = '/api/training/student';
export type ApiApiTrainingStudentcreateMethod = 'post';
export type ApiApiTrainingStudentcreateRequestBody =
  components['schemas']['training-student.dto.studentCreate'];
export type ApiApiTrainingStudentcreateResponseBody =
  paths[ApiApiTrainingStudentcreatePath][ApiApiTrainingStudentcreateMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_view */
export const ApiApiTrainingStudentviewPath = '/api/training/student/{id}';
export type ApiApiTrainingStudentviewPath = '/api/training/student/{id}';
export type ApiApiTrainingStudentviewMethod = 'get';
export type ApiApiTrainingStudentviewRequestParams =
  paths[ApiApiTrainingStudentviewPath][ApiApiTrainingStudentviewMethod]['parameters']['path'];
export type ApiApiTrainingStudentviewResponseBody =
  paths[ApiApiTrainingStudentviewPath][ApiApiTrainingStudentviewMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_delete */
export const ApiApiTrainingStudentdeletePath = '/api/training/student/{id}';
export type ApiApiTrainingStudentdeletePath = '/api/training/student/{id}';
export type ApiApiTrainingStudentdeleteMethod = 'delete';
export type ApiApiTrainingStudentdeleteRequestParams =
  paths[ApiApiTrainingStudentdeletePath][ApiApiTrainingStudentdeleteMethod]['parameters']['path'];
export type ApiApiTrainingStudentdeleteResponseBody =
  paths[ApiApiTrainingStudentdeletePath][ApiApiTrainingStudentdeleteMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_update */
export const ApiApiTrainingStudentupdatePath = '/api/training/student/{id}';
export type ApiApiTrainingStudentupdatePath = '/api/training/student/{id}';
export type ApiApiTrainingStudentupdateMethod = 'patch';
export type ApiApiTrainingStudentupdateRequestParams =
  paths[ApiApiTrainingStudentupdatePath][ApiApiTrainingStudentupdateMethod]['parameters']['path'];
export type ApiApiTrainingStudentupdateRequestBody =
  components['schemas']['training-student.dto.studentUpdate'];
export type ApiApiTrainingStudentupdateResponseBody =
  paths[ApiApiTrainingStudentupdatePath][ApiApiTrainingStudentupdateMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_summary */
export const ApiApiTrainingStudentsummaryPath = '/api/training/student/summary/{id}';
export type ApiApiTrainingStudentsummaryPath = '/api/training/student/summary/{id}';
export type ApiApiTrainingStudentsummaryMethod = 'get';
export type ApiApiTrainingStudentsummaryRequestParams =
  paths[ApiApiTrainingStudentsummaryPath][ApiApiTrainingStudentsummaryMethod]['parameters']['path'];
export type ApiApiTrainingStudentsummaryResponseBody =
  paths[ApiApiTrainingStudentsummaryPath][ApiApiTrainingStudentsummaryMethod]['responses']['200']['content']['application/json']['data'];

/** TrainingStudent_deleteForce */
export const ApiApiTrainingStudentdeleteForcePath = '/api/training/student/deleteForce/{id}';
export type ApiApiTrainingStudentdeleteForcePath = '/api/training/student/deleteForce/{id}';
export type ApiApiTrainingStudentdeleteForceMethod = 'delete';
export type ApiApiTrainingStudentdeleteForceRequestParams =
  paths[ApiApiTrainingStudentdeleteForcePath][ApiApiTrainingStudentdeleteForceMethod]['parameters']['path'];
export type ApiApiTrainingStudentdeleteForceResponseBody =
  paths[ApiApiTrainingStudentdeleteForcePath][ApiApiTrainingStudentdeleteForceMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiTrainingStudent extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiTrainingStudentselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTrainingStudentselectResponseBody>(
      ApiApiTrainingStudentselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiTrainingStudentcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiTrainingStudentcreateResponseBody>(
      ApiApiTrainingStudentcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiTrainingStudentviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTrainingStudentviewResponseBody>(
      this.$pathTranslate(ApiApiTrainingStudentviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiTrainingStudentdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiTrainingStudentdeleteResponseBody>(
      this.$pathTranslate(ApiApiTrainingStudentdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiTrainingStudentupdateRequestBody,
    options: {
      params: ApiApiTrainingStudentupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiTrainingStudentupdateResponseBody>(
      this.$pathTranslate(ApiApiTrainingStudentupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  summary(
    options: {
      params: ApiApiTrainingStudentsummaryRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTrainingStudentsummaryResponseBody>(
      this.$pathTranslate(ApiApiTrainingStudentsummaryPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteForce(
    options: {
      params: ApiApiTrainingStudentdeleteForceRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiTrainingStudentdeleteForceResponseBody>(
      this.$pathTranslate(ApiApiTrainingStudentdeleteForcePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
