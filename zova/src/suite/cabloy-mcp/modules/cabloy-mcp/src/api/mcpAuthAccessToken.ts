import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** McpAuthAccessToken_mine */
export const ApiApiMcpAuthAccessTokenminePath = '/api/mcp/auth/accessToken/mine';
export type ApiApiMcpAuthAccessTokenminePath = '/api/mcp/auth/accessToken/mine';
export type ApiApiMcpAuthAccessTokenmineMethod = 'get';
export type ApiApiMcpAuthAccessTokenmineRequestQuery =
  paths[ApiApiMcpAuthAccessTokenminePath][ApiApiMcpAuthAccessTokenmineMethod]['parameters']['query'];
export type ApiApiMcpAuthAccessTokenmineResponseBody =
  paths[ApiApiMcpAuthAccessTokenminePath][ApiApiMcpAuthAccessTokenmineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthAccessToken_createMine */
export const ApiApiMcpAuthAccessTokencreateMinePath = '/api/mcp/auth/accessToken/createMine';
export type ApiApiMcpAuthAccessTokencreateMinePath = '/api/mcp/auth/accessToken/createMine';
export type ApiApiMcpAuthAccessTokencreateMineMethod = 'post';
export type ApiApiMcpAuthAccessTokencreateMineRequestQuery =
  paths[ApiApiMcpAuthAccessTokencreateMinePath][ApiApiMcpAuthAccessTokencreateMineMethod]['parameters']['query'];
export type ApiApiMcpAuthAccessTokencreateMineRequestBody =
  components['schemas']['mcp-auth.dto.accessTokenCreate'];
export type ApiApiMcpAuthAccessTokencreateMineResponseBody =
  paths[ApiApiMcpAuthAccessTokencreateMinePath][ApiApiMcpAuthAccessTokencreateMineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthAccessToken_deleteMine */
export const ApiApiMcpAuthAccessTokendeleteMinePath = '/api/mcp/auth/accessToken/deleteMine/{id}';
export type ApiApiMcpAuthAccessTokendeleteMinePath = '/api/mcp/auth/accessToken/deleteMine/{id}';
export type ApiApiMcpAuthAccessTokendeleteMineMethod = 'delete';
export type ApiApiMcpAuthAccessTokendeleteMineRequestParams =
  paths[ApiApiMcpAuthAccessTokendeleteMinePath][ApiApiMcpAuthAccessTokendeleteMineMethod]['parameters']['path'];
export type ApiApiMcpAuthAccessTokendeleteMineRequestQuery =
  paths[ApiApiMcpAuthAccessTokendeleteMinePath][ApiApiMcpAuthAccessTokendeleteMineMethod]['parameters']['query'];
export type ApiApiMcpAuthAccessTokendeleteMineResponseBody =
  paths[ApiApiMcpAuthAccessTokendeleteMinePath][ApiApiMcpAuthAccessTokendeleteMineMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiMcpAuthAccessToken extends BeanApiBase {
  mine(
    options: {
      query: ApiApiMcpAuthAccessTokenmineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiMcpAuthAccessTokenmineResponseBody>(
      ApiApiMcpAuthAccessTokenminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  createMine(
    body: ApiApiMcpAuthAccessTokencreateMineRequestBody,
    options: {
      query: ApiApiMcpAuthAccessTokencreateMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiMcpAuthAccessTokencreateMineResponseBody>(
      ApiApiMcpAuthAccessTokencreateMinePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteMine(
    options: {
      params: ApiApiMcpAuthAccessTokendeleteMineRequestParams;
      query: ApiApiMcpAuthAccessTokendeleteMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiMcpAuthAccessTokendeleteMineResponseBody>(
      this.$pathTranslate(ApiApiMcpAuthAccessTokendeleteMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
