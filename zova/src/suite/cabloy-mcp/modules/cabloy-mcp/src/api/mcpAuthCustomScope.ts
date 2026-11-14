import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.ts';

import { OpenApiBaseURL } from './openapi/index.ts';

/** McpAuthCustomScope_mine */
export const ApiApiMcpAuthCustomScopeminePath = '/api/mcp/auth/customScope/mine';
export type ApiApiMcpAuthCustomScopeminePath = '/api/mcp/auth/customScope/mine';
export type ApiApiMcpAuthCustomScopemineMethod = 'get';
export type ApiApiMcpAuthCustomScopemineRequestQuery =
  paths[ApiApiMcpAuthCustomScopeminePath][ApiApiMcpAuthCustomScopemineMethod]['parameters']['query'];
export type ApiApiMcpAuthCustomScopemineResponseBody =
  paths[ApiApiMcpAuthCustomScopeminePath][ApiApiMcpAuthCustomScopemineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthCustomScope_catalog */
export const ApiApiMcpAuthCustomScopecatalogPath = '/api/mcp/auth/customScope/catalog';
export type ApiApiMcpAuthCustomScopecatalogPath = '/api/mcp/auth/customScope/catalog';
export type ApiApiMcpAuthCustomScopecatalogMethod = 'get';
export type ApiApiMcpAuthCustomScopecatalogRequestQuery =
  paths[ApiApiMcpAuthCustomScopecatalogPath][ApiApiMcpAuthCustomScopecatalogMethod]['parameters']['query'];
export type ApiApiMcpAuthCustomScopecatalogResponseBody =
  paths[ApiApiMcpAuthCustomScopecatalogPath][ApiApiMcpAuthCustomScopecatalogMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthCustomScope_createMine */
export const ApiApiMcpAuthCustomScopecreateMinePath = '/api/mcp/auth/customScope/createMine';
export type ApiApiMcpAuthCustomScopecreateMinePath = '/api/mcp/auth/customScope/createMine';
export type ApiApiMcpAuthCustomScopecreateMineMethod = 'post';
export type ApiApiMcpAuthCustomScopecreateMineRequestQuery =
  paths[ApiApiMcpAuthCustomScopecreateMinePath][ApiApiMcpAuthCustomScopecreateMineMethod]['parameters']['query'];
export type ApiApiMcpAuthCustomScopecreateMineRequestBody =
  components['schemas']['mcp-auth.dto.customScopeCreate_1ff20af69286149eb0b25291d9450172f7bd0054'];
export type ApiApiMcpAuthCustomScopecreateMineResponseBody =
  paths[ApiApiMcpAuthCustomScopecreateMinePath][ApiApiMcpAuthCustomScopecreateMineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthCustomScope_updateMine */
export const ApiApiMcpAuthCustomScopeupdateMinePath = '/api/mcp/auth/customScope/updateMine/{id}';
export type ApiApiMcpAuthCustomScopeupdateMinePath = '/api/mcp/auth/customScope/updateMine/{id}';
export type ApiApiMcpAuthCustomScopeupdateMineMethod = 'post';
export type ApiApiMcpAuthCustomScopeupdateMineRequestParams =
  paths[ApiApiMcpAuthCustomScopeupdateMinePath][ApiApiMcpAuthCustomScopeupdateMineMethod]['parameters']['path'];
export type ApiApiMcpAuthCustomScopeupdateMineRequestQuery =
  paths[ApiApiMcpAuthCustomScopeupdateMinePath][ApiApiMcpAuthCustomScopeupdateMineMethod]['parameters']['query'];
export type ApiApiMcpAuthCustomScopeupdateMineRequestBody =
  components['schemas']['mcp-auth.dto.customScopeCreate_1ff20af69286149eb0b25291d9450172f7bd0054'];
export type ApiApiMcpAuthCustomScopeupdateMineResponseBody =
  paths[ApiApiMcpAuthCustomScopeupdateMinePath][ApiApiMcpAuthCustomScopeupdateMineMethod]['responses']['200']['content']['application/json']['data'];

/** McpAuthCustomScope_deleteMine */
export const ApiApiMcpAuthCustomScopedeleteMinePath = '/api/mcp/auth/customScope/deleteMine/{id}';
export type ApiApiMcpAuthCustomScopedeleteMinePath = '/api/mcp/auth/customScope/deleteMine/{id}';
export type ApiApiMcpAuthCustomScopedeleteMineMethod = 'delete';
export type ApiApiMcpAuthCustomScopedeleteMineRequestParams =
  paths[ApiApiMcpAuthCustomScopedeleteMinePath][ApiApiMcpAuthCustomScopedeleteMineMethod]['parameters']['path'];
export type ApiApiMcpAuthCustomScopedeleteMineRequestQuery =
  paths[ApiApiMcpAuthCustomScopedeleteMinePath][ApiApiMcpAuthCustomScopedeleteMineMethod]['parameters']['query'];
export type ApiApiMcpAuthCustomScopedeleteMineResponseBody =
  paths[ApiApiMcpAuthCustomScopedeleteMinePath][ApiApiMcpAuthCustomScopedeleteMineMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiMcpAuthCustomScope extends BeanApiBase {
  /** List personal MCP scopes */
  mine(
    options: {
      query: ApiApiMcpAuthCustomScopemineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiMcpAuthCustomScopemineResponseBody>(
      ApiApiMcpAuthCustomScopeminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  /** Available MCP tools */
  catalog(
    options: {
      query: ApiApiMcpAuthCustomScopecatalogRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiMcpAuthCustomScopecatalogResponseBody>(
      ApiApiMcpAuthCustomScopecatalogPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  /** Create personal MCP scope */
  createMine(
    body: ApiApiMcpAuthCustomScopecreateMineRequestBody,
    options: {
      query: ApiApiMcpAuthCustomScopecreateMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiMcpAuthCustomScopecreateMineResponseBody>(
      ApiApiMcpAuthCustomScopecreateMinePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  /** Update personal MCP scope */
  updateMine(
    body: ApiApiMcpAuthCustomScopeupdateMineRequestBody,
    options: {
      params: ApiApiMcpAuthCustomScopeupdateMineRequestParams;
      query: ApiApiMcpAuthCustomScopeupdateMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiMcpAuthCustomScopeupdateMineResponseBody>(
      this.$pathTranslate(ApiApiMcpAuthCustomScopeupdateMinePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  /** Delete personal MCP scope */
  deleteMine(
    options: {
      params: ApiApiMcpAuthCustomScopedeleteMineRequestParams;
      query: ApiApiMcpAuthCustomScopedeleteMineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiMcpAuthCustomScopedeleteMineResponseBody>(
      this.$pathTranslate(ApiApiMcpAuthCustomScopedeleteMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
