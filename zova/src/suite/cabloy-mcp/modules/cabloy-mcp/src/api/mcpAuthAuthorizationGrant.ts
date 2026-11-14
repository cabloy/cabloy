import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** McpAuthAuthorizationGrant_mine */
export const ApiApiMcpAuthAuthorizationGrantminePath = '/api/mcp/auth/authorizationGrant/mine';
export type ApiApiMcpAuthAuthorizationGrantminePath = '/api/mcp/auth/authorizationGrant/mine';
export type ApiApiMcpAuthAuthorizationGrantmineMethod = 'get';
export type ApiApiMcpAuthAuthorizationGrantmineRequestQuery =
  paths[ApiApiMcpAuthAuthorizationGrantminePath][ApiApiMcpAuthAuthorizationGrantmineMethod]['parameters']['query'];
export type ApiApiMcpAuthAuthorizationGrantmineResponseBody =
  paths[ApiApiMcpAuthAuthorizationGrantminePath][ApiApiMcpAuthAuthorizationGrantmineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthAuthorizationGrant_revokeMine */
export const ApiApiMcpAuthAuthorizationGrantrevokeMinePath =
  '/api/mcp/auth/authorizationGrant/revokeMine/{id}';
export type ApiApiMcpAuthAuthorizationGrantrevokeMinePath =
  '/api/mcp/auth/authorizationGrant/revokeMine/{id}';
export type ApiApiMcpAuthAuthorizationGrantrevokeMineMethod = 'post';
export type ApiApiMcpAuthAuthorizationGrantrevokeMineRequestParams =
  paths[ApiApiMcpAuthAuthorizationGrantrevokeMinePath][ApiApiMcpAuthAuthorizationGrantrevokeMineMethod]['parameters']['path'];
export type ApiApiMcpAuthAuthorizationGrantrevokeMineRequestQuery =
  paths[ApiApiMcpAuthAuthorizationGrantrevokeMinePath][ApiApiMcpAuthAuthorizationGrantrevokeMineMethod]['parameters']['query'];
export type ApiApiMcpAuthAuthorizationGrantrevokeMineResponseBody =
  paths[ApiApiMcpAuthAuthorizationGrantrevokeMinePath][ApiApiMcpAuthAuthorizationGrantrevokeMineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthAuthorizationGrant_deleteMine */
export const ApiApiMcpAuthAuthorizationGrantdeleteMinePath =
  '/api/mcp/auth/authorizationGrant/deleteMine/{id}';
export type ApiApiMcpAuthAuthorizationGrantdeleteMinePath =
  '/api/mcp/auth/authorizationGrant/deleteMine/{id}';
export type ApiApiMcpAuthAuthorizationGrantdeleteMineMethod = 'delete';
export type ApiApiMcpAuthAuthorizationGrantdeleteMineRequestParams =
  paths[ApiApiMcpAuthAuthorizationGrantdeleteMinePath][ApiApiMcpAuthAuthorizationGrantdeleteMineMethod]['parameters']['path'];
export type ApiApiMcpAuthAuthorizationGrantdeleteMineRequestQuery =
  paths[ApiApiMcpAuthAuthorizationGrantdeleteMinePath][ApiApiMcpAuthAuthorizationGrantdeleteMineMethod]['parameters']['query'];
export type ApiApiMcpAuthAuthorizationGrantdeleteMineResponseBody =
  paths[ApiApiMcpAuthAuthorizationGrantdeleteMinePath][ApiApiMcpAuthAuthorizationGrantdeleteMineMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiMcpAuthAuthorizationGrant extends BeanApiBase {
  mine(
    options: {
      query: ApiApiMcpAuthAuthorizationGrantmineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiMcpAuthAuthorizationGrantmineResponseBody>(
      ApiApiMcpAuthAuthorizationGrantminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  revokeMine(
    body: undefined,
    options: {
      params: ApiApiMcpAuthAuthorizationGrantrevokeMineRequestParams;
      query: ApiApiMcpAuthAuthorizationGrantrevokeMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiMcpAuthAuthorizationGrantrevokeMineResponseBody>(
      this.$pathTranslate(ApiApiMcpAuthAuthorizationGrantrevokeMinePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteMine(
    options: {
      params: ApiApiMcpAuthAuthorizationGrantdeleteMineRequestParams;
      query: ApiApiMcpAuthAuthorizationGrantdeleteMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiMcpAuthAuthorizationGrantdeleteMineResponseBody>(
      this.$pathTranslate(ApiApiMcpAuthAuthorizationGrantdeleteMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
