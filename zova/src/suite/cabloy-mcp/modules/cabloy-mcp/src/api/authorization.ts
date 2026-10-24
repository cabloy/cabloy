import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** Authorization_summary */
export const ApiApiAuthorizationsummaryPath = '/mcp/auth/summary';
export type ApiApiAuthorizationsummaryPath = '/mcp/auth/summary';
export type ApiApiAuthorizationsummaryMethod = 'get';
export type ApiApiAuthorizationsummaryRequestQuery =
  paths[ApiApiAuthorizationsummaryPath][ApiApiAuthorizationsummaryMethod]['parameters']['query'];
export type ApiApiAuthorizationsummaryResponseBody =
  paths[ApiApiAuthorizationsummaryPath][ApiApiAuthorizationsummaryMethod]['responses']['200']['content']['application/json']['data'];

/** Authorization_decision */
export const ApiApiAuthorizationdecisionPath = '/mcp/auth/decision';
export type ApiApiAuthorizationdecisionPath = '/mcp/auth/decision';
export type ApiApiAuthorizationdecisionMethod = 'post';
export type ApiApiAuthorizationdecisionRequestBody =
  components['schemas']['mcp-auth.dto.authorizationDecision'];
export type ApiApiAuthorizationdecisionResponseBody =
  paths[ApiApiAuthorizationdecisionPath][ApiApiAuthorizationdecisionMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiAuthorization extends BeanApiBase {
  summary(
    options: {
      query: ApiApiAuthorizationsummaryRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiAuthorizationsummaryResponseBody>(
      ApiApiAuthorizationsummaryPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  decision(body: ApiApiAuthorizationdecisionRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiAuthorizationdecisionResponseBody>(
      ApiApiAuthorizationdecisionPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
