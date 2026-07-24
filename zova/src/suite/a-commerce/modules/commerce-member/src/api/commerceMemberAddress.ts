import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceMemberAddress_mine */
export const ApiApiCommerceMemberAddressminePath = '/api/commerce/member/address/mine';
export type ApiApiCommerceMemberAddressminePath = '/api/commerce/member/address/mine';
export type ApiApiCommerceMemberAddressmineMethod = 'get';
export type ApiApiCommerceMemberAddressmineRequestQuery =
  paths[ApiApiCommerceMemberAddressminePath][ApiApiCommerceMemberAddressmineMethod]['parameters']['query'];
export type ApiApiCommerceMemberAddressmineResponseBody =
  paths[ApiApiCommerceMemberAddressminePath][ApiApiCommerceMemberAddressmineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_viewMine */
export const ApiApiCommerceMemberAddressviewMinePath = '/api/commerce/member/address/viewMine/{id}';
export type ApiApiCommerceMemberAddressviewMinePath = '/api/commerce/member/address/viewMine/{id}';
export type ApiApiCommerceMemberAddressviewMineMethod = 'get';
export type ApiApiCommerceMemberAddressviewMineRequestParams =
  paths[ApiApiCommerceMemberAddressviewMinePath][ApiApiCommerceMemberAddressviewMineMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressviewMineResponseBody =
  paths[ApiApiCommerceMemberAddressviewMinePath][ApiApiCommerceMemberAddressviewMineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_createMine */
export const ApiApiCommerceMemberAddresscreateMinePath = '/api/commerce/member/address/createMine';
export type ApiApiCommerceMemberAddresscreateMinePath = '/api/commerce/member/address/createMine';
export type ApiApiCommerceMemberAddresscreateMineMethod = 'post';
export type ApiApiCommerceMemberAddresscreateMineRequestBody =
  components['schemas']['commerce-member.dto.addressMineCreate'];
export type ApiApiCommerceMemberAddresscreateMineResponseBody =
  paths[ApiApiCommerceMemberAddresscreateMinePath][ApiApiCommerceMemberAddresscreateMineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_updateMine */
export const ApiApiCommerceMemberAddressupdateMinePath =
  '/api/commerce/member/address/updateMine/{id}';
export type ApiApiCommerceMemberAddressupdateMinePath =
  '/api/commerce/member/address/updateMine/{id}';
export type ApiApiCommerceMemberAddressupdateMineMethod = 'patch';
export type ApiApiCommerceMemberAddressupdateMineRequestParams =
  paths[ApiApiCommerceMemberAddressupdateMinePath][ApiApiCommerceMemberAddressupdateMineMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressupdateMineRequestBody =
  components['schemas']['commerce-member.dto.addressMineUpdate'];
export type ApiApiCommerceMemberAddressupdateMineResponseBody =
  paths[ApiApiCommerceMemberAddressupdateMinePath][ApiApiCommerceMemberAddressupdateMineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_deleteMine */
export const ApiApiCommerceMemberAddressdeleteMinePath =
  '/api/commerce/member/address/deleteMine/{id}';
export type ApiApiCommerceMemberAddressdeleteMinePath =
  '/api/commerce/member/address/deleteMine/{id}';
export type ApiApiCommerceMemberAddressdeleteMineMethod = 'delete';
export type ApiApiCommerceMemberAddressdeleteMineRequestParams =
  paths[ApiApiCommerceMemberAddressdeleteMinePath][ApiApiCommerceMemberAddressdeleteMineMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressdeleteMineResponseBody =
  paths[ApiApiCommerceMemberAddressdeleteMinePath][ApiApiCommerceMemberAddressdeleteMineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_select */
export const ApiApiCommerceMemberAddressselectPath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddressselectPath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddressselectMethod = 'get';
export type ApiApiCommerceMemberAddressselectRequestQuery =
  paths[ApiApiCommerceMemberAddressselectPath][ApiApiCommerceMemberAddressselectMethod]['parameters']['query'];
export type ApiApiCommerceMemberAddressselectResponseBody =
  paths[ApiApiCommerceMemberAddressselectPath][ApiApiCommerceMemberAddressselectMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_view */
export const ApiApiCommerceMemberAddressviewPath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressviewPath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressviewMethod = 'get';
export type ApiApiCommerceMemberAddressviewRequestParams =
  paths[ApiApiCommerceMemberAddressviewPath][ApiApiCommerceMemberAddressviewMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressviewResponseBody =
  paths[ApiApiCommerceMemberAddressviewPath][ApiApiCommerceMemberAddressviewMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceMemberAddress extends BeanApiBase {
  mine(
    options?: {
      query?: ApiApiCommerceMemberAddressmineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceMemberAddressmineResponseBody>(
      ApiApiCommerceMemberAddressminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  viewMine(
    options: {
      params: ApiApiCommerceMemberAddressviewMineRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceMemberAddressviewMineResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressviewMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  createMine(body: ApiApiCommerceMemberAddresscreateMineRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCommerceMemberAddresscreateMineResponseBody>(
      ApiApiCommerceMemberAddresscreateMinePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateMine(
    body: ApiApiCommerceMemberAddressupdateMineRequestBody,
    options: {
      params: ApiApiCommerceMemberAddressupdateMineRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiCommerceMemberAddressupdateMineResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressupdateMinePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteMine(
    options: {
      params: ApiApiCommerceMemberAddressdeleteMineRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiCommerceMemberAddressdeleteMineResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressdeleteMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  select(
    options?: {
      query?: ApiApiCommerceMemberAddressselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceMemberAddressselectResponseBody>(
      ApiApiCommerceMemberAddressselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiCommerceMemberAddressviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceMemberAddressviewResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
