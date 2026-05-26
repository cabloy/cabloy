import { Api, BeanApiBase, IApiActionOptions } from 'zova-module-a-api';

import { OpenApiBaseURL, type components, type paths } from './openapi/index.js';

/** TestSsrToolOne_testGet */
export const ApiApiTestSsrToolOnetestGetPath = '/api/test/ssr/toolOne/test/{id?}';
export type ApiApiTestSsrToolOnetestGetPath = '/api/test/ssr/toolOne/test/{id?}';
export type ApiApiTestSsrToolOnetestGetMethod = 'get';
export type ApiApiTestSsrToolOnetestGetRequestParams =
  paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['parameters']['path'];
export type ApiApiTestSsrToolOnetestGetRequestQuery =
  paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['parameters']['query'];
export type ApiApiTestSsrToolOnetestGetResponseBody =
  paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['responses']['200']['content']['application/json']['data'];

/** TestSsrToolOne_test */
export const ApiApiTestSsrToolOnetestPath = '/api/test/ssr/toolOne/test/{id?}';
export type ApiApiTestSsrToolOnetestPath = '/api/test/ssr/toolOne/test/{id?}';
export type ApiApiTestSsrToolOnetestMethod = 'post';
export type ApiApiTestSsrToolOnetestRequestParams =
  paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['parameters']['path'];
export type ApiApiTestSsrToolOnetestRequestQuery =
  paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['parameters']['query'];
export type ApiApiTestSsrToolOnetestRequestBody = components['schemas']['test-ssr.dto.testBody'];
export type ApiApiTestSsrToolOnetestResponseBody =
  paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiTestSsrToolOne extends BeanApiBase {
  testGet(
    options: {
      params: ApiApiTestSsrToolOnetestGetRequestParams;
      query: ApiApiTestSsrToolOnetestGetRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiTestSsrToolOnetestGetResponseBody>(
      this.$pathTranslate(ApiApiTestSsrToolOnetestGetPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  test(
    body: ApiApiTestSsrToolOnetestRequestBody,
    options: {
      params: ApiApiTestSsrToolOnetestRequestParams;
      query: ApiApiTestSsrToolOnetestRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiTestSsrToolOnetestResponseBody>(
      this.$pathTranslate(ApiApiTestSsrToolOnetestPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
