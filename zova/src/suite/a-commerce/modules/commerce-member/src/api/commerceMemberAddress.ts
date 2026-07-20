import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceMemberAddress_select */
export const ApiApiCommerceMemberAddressselectPath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddressselectPath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddressselectMethod = 'get';
export type ApiApiCommerceMemberAddressselectRequestQuery =
  paths[ApiApiCommerceMemberAddressselectPath][ApiApiCommerceMemberAddressselectMethod]['parameters']['query'];
export type ApiApiCommerceMemberAddressselectResponseBody =
  paths[ApiApiCommerceMemberAddressselectPath][ApiApiCommerceMemberAddressselectMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_create */
export const ApiApiCommerceMemberAddresscreatePath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddresscreatePath = '/api/commerce/member/address';
export type ApiApiCommerceMemberAddresscreateMethod = 'post';
export type ApiApiCommerceMemberAddresscreateRequestBody =
  components['schemas']['commerce-member.dto.addressCreate'];
export type ApiApiCommerceMemberAddresscreateResponseBody =
  paths[ApiApiCommerceMemberAddresscreatePath][ApiApiCommerceMemberAddresscreateMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_view */
export const ApiApiCommerceMemberAddressviewPath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressviewPath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressviewMethod = 'get';
export type ApiApiCommerceMemberAddressviewRequestParams =
  paths[ApiApiCommerceMemberAddressviewPath][ApiApiCommerceMemberAddressviewMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressviewResponseBody =
  paths[ApiApiCommerceMemberAddressviewPath][ApiApiCommerceMemberAddressviewMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_delete */
export const ApiApiCommerceMemberAddressdeletePath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressdeletePath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressdeleteMethod = 'delete';
export type ApiApiCommerceMemberAddressdeleteRequestParams =
  paths[ApiApiCommerceMemberAddressdeletePath][ApiApiCommerceMemberAddressdeleteMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressdeleteResponseBody =
  paths[ApiApiCommerceMemberAddressdeletePath][ApiApiCommerceMemberAddressdeleteMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceMemberAddress_update */
export const ApiApiCommerceMemberAddressupdatePath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressupdatePath = '/api/commerce/member/address/{id}';
export type ApiApiCommerceMemberAddressupdateMethod = 'patch';
export type ApiApiCommerceMemberAddressupdateRequestParams =
  paths[ApiApiCommerceMemberAddressupdatePath][ApiApiCommerceMemberAddressupdateMethod]['parameters']['path'];
export type ApiApiCommerceMemberAddressupdateRequestBody =
  components['schemas']['commerce-member.dto.addressUpdate'];
export type ApiApiCommerceMemberAddressupdateResponseBody =
  paths[ApiApiCommerceMemberAddressupdatePath][ApiApiCommerceMemberAddressupdateMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceMemberAddress extends BeanApiBase {
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

  create(body: ApiApiCommerceMemberAddresscreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCommerceMemberAddresscreateResponseBody>(
      ApiApiCommerceMemberAddresscreatePath,
      body,
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

  delete(
    options: {
      params: ApiApiCommerceMemberAddressdeleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiCommerceMemberAddressdeleteResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressdeletePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  update(
    body: ApiApiCommerceMemberAddressupdateRequestBody,
    options: {
      params: ApiApiCommerceMemberAddressupdateRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiCommerceMemberAddressupdateResponseBody>(
      this.$pathTranslate(ApiApiCommerceMemberAddressupdatePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
