import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type components, type paths } from './openapi/index.js';

/** DemoStudent_select */
export const ApiApiDemoStudentselectPath = '/api/demo/student';
export type ApiApiDemoStudentselectPath = '/api/demo/student';
export type ApiApiDemoStudentselectMethod = 'get';
export type ApiApiDemoStudentselectRequestQuery =
  paths[ApiApiDemoStudentselectPath][ApiApiDemoStudentselectMethod]['parameters']['query'];
export type ApiApiDemoStudentselectResponseBody =
  paths[ApiApiDemoStudentselectPath][ApiApiDemoStudentselectMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_create */
export const ApiApiDemoStudentcreatePath = '/api/demo/student';
export type ApiApiDemoStudentcreatePath = '/api/demo/student';
export type ApiApiDemoStudentcreateMethod = 'post';
export type ApiApiDemoStudentcreateRequestBody =
  components['schemas']['demo-student.dto.studentCreate'];
export type ApiApiDemoStudentcreateResponseBody =
  paths[ApiApiDemoStudentcreatePath][ApiApiDemoStudentcreateMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_view */
export const ApiApiDemoStudentviewPath = '/api/demo/student/{id}';
export type ApiApiDemoStudentviewPath = '/api/demo/student/{id}';
export type ApiApiDemoStudentviewMethod = 'get';
export type ApiApiDemoStudentviewRequestParams =
  paths[ApiApiDemoStudentviewPath][ApiApiDemoStudentviewMethod]['parameters']['path'];
export type ApiApiDemoStudentviewResponseBody =
  paths[ApiApiDemoStudentviewPath][ApiApiDemoStudentviewMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_delete */
export const ApiApiDemoStudentdeletePath = '/api/demo/student/{id}';
export type ApiApiDemoStudentdeletePath = '/api/demo/student/{id}';
export type ApiApiDemoStudentdeleteMethod = 'delete';
export type ApiApiDemoStudentdeleteRequestParams =
  paths[ApiApiDemoStudentdeletePath][ApiApiDemoStudentdeleteMethod]['parameters']['path'];
export type ApiApiDemoStudentdeleteResponseBody =
  paths[ApiApiDemoStudentdeletePath][ApiApiDemoStudentdeleteMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_update */
export const ApiApiDemoStudentupdatePath = '/api/demo/student/{id}';
export type ApiApiDemoStudentupdatePath = '/api/demo/student/{id}';
export type ApiApiDemoStudentupdateMethod = 'patch';
export type ApiApiDemoStudentupdateRequestParams =
  paths[ApiApiDemoStudentupdatePath][ApiApiDemoStudentupdateMethod]['parameters']['path'];
export type ApiApiDemoStudentupdateRequestBody =
  components['schemas']['demo-student.dto.studentUpdate'];
export type ApiApiDemoStudentupdateResponseBody =
  paths[ApiApiDemoStudentupdatePath][ApiApiDemoStudentupdateMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_summary */
export const ApiApiDemoStudentsummaryPath = '/api/demo/student/summary/{id}';
export type ApiApiDemoStudentsummaryPath = '/api/demo/student/summary/{id}';
export type ApiApiDemoStudentsummaryMethod = 'get';
export type ApiApiDemoStudentsummaryRequestParams =
  paths[ApiApiDemoStudentsummaryPath][ApiApiDemoStudentsummaryMethod]['parameters']['path'];
export type ApiApiDemoStudentsummaryResponseBody =
  paths[ApiApiDemoStudentsummaryPath][ApiApiDemoStudentsummaryMethod]['responses']['200']['content']['application/json']['data'];

/** DemoStudent_deleteForce */
export const ApiApiDemoStudentdeleteForcePath = '/api/demo/student/deleteForce/{id}';
export type ApiApiDemoStudentdeleteForcePath = '/api/demo/student/deleteForce/{id}';
export type ApiApiDemoStudentdeleteForceMethod = 'delete';
export type ApiApiDemoStudentdeleteForceRequestParams =
  paths[ApiApiDemoStudentdeleteForcePath][ApiApiDemoStudentdeleteForceMethod]['parameters']['path'];
export type ApiApiDemoStudentdeleteForceResponseBody =
  paths[ApiApiDemoStudentdeleteForcePath][ApiApiDemoStudentdeleteForceMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiDemoStudent extends BeanApiBase {
  select(
    options?: {
      query?: ApiApiDemoStudentselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiDemoStudentselectResponseBody>(
      ApiApiDemoStudentselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiDemoStudentcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiDemoStudentcreateResponseBody>(
      ApiApiDemoStudentcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiDemoStudentviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiDemoStudentviewResponseBody>(
      this.$pathTranslate(ApiApiDemoStudentviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  delete(
    options: {
      params: ApiApiDemoStudentdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiDemoStudentdeleteResponseBody>(
      this.$pathTranslate(ApiApiDemoStudentdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiDemoStudentupdateRequestBody,
    options: {
      params: ApiApiDemoStudentupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiDemoStudentupdateResponseBody>(
      this.$pathTranslate(ApiApiDemoStudentupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  summary(
    options: {
      params: ApiApiDemoStudentsummaryRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiDemoStudentsummaryResponseBody>(
      this.$pathTranslate(ApiApiDemoStudentsummaryPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteForce(
    options: {
      params: ApiApiDemoStudentdeleteForceRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiDemoStudentdeleteForceResponseBody>(
      this.$pathTranslate(ApiApiDemoStudentdeleteForcePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
