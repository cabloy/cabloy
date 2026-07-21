import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeCart_current */
export const ApiApiCommerceTradeCartcurrentPath = '/api/commerce/trade/cart';
export type ApiApiCommerceTradeCartcurrentPath = '/api/commerce/trade/cart';
export type ApiApiCommerceTradeCartcurrentMethod = 'get';
export type ApiApiCommerceTradeCartcurrentResponseBody =
  paths[ApiApiCommerceTradeCartcurrentPath][ApiApiCommerceTradeCartcurrentMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeCart_addItem */
export const ApiApiCommerceTradeCartaddItemPath = '/api/commerce/trade/cart/items';
export type ApiApiCommerceTradeCartaddItemPath = '/api/commerce/trade/cart/items';
export type ApiApiCommerceTradeCartaddItemMethod = 'post';
export type ApiApiCommerceTradeCartaddItemRequestBody =
  components['schemas']['commerce-trade.dto.cartAddItem'];
export type ApiApiCommerceTradeCartaddItemResponseBody =
  paths[ApiApiCommerceTradeCartaddItemPath][ApiApiCommerceTradeCartaddItemMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeCart_clear */
export const ApiApiCommerceTradeCartclearPath = '/api/commerce/trade/cart/items';
export type ApiApiCommerceTradeCartclearPath = '/api/commerce/trade/cart/items';
export type ApiApiCommerceTradeCartclearMethod = 'delete';
export type ApiApiCommerceTradeCartclearResponseBody =
  paths[ApiApiCommerceTradeCartclearPath][ApiApiCommerceTradeCartclearMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeCart_deleteItem */
export const ApiApiCommerceTradeCartdeleteItemPath = '/api/commerce/trade/cart/items/{id}';
export type ApiApiCommerceTradeCartdeleteItemPath = '/api/commerce/trade/cart/items/{id}';
export type ApiApiCommerceTradeCartdeleteItemMethod = 'delete';
export type ApiApiCommerceTradeCartdeleteItemRequestParams =
  paths[ApiApiCommerceTradeCartdeleteItemPath][ApiApiCommerceTradeCartdeleteItemMethod]['parameters']['path'];
export type ApiApiCommerceTradeCartdeleteItemResponseBody =
  paths[ApiApiCommerceTradeCartdeleteItemPath][ApiApiCommerceTradeCartdeleteItemMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeCart_updateItem */
export const ApiApiCommerceTradeCartupdateItemPath = '/api/commerce/trade/cart/items/{id}';
export type ApiApiCommerceTradeCartupdateItemPath = '/api/commerce/trade/cart/items/{id}';
export type ApiApiCommerceTradeCartupdateItemMethod = 'patch';
export type ApiApiCommerceTradeCartupdateItemRequestParams =
  paths[ApiApiCommerceTradeCartupdateItemPath][ApiApiCommerceTradeCartupdateItemMethod]['parameters']['path'];
export type ApiApiCommerceTradeCartupdateItemRequestBody =
  components['schemas']['commerce-trade.dto.cartUpdateItem'];
export type ApiApiCommerceTradeCartupdateItemResponseBody =
  paths[ApiApiCommerceTradeCartupdateItemPath][ApiApiCommerceTradeCartupdateItemMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceTradeCart extends BeanApiBase {
  current(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiCommerceTradeCartcurrentResponseBody>(
      ApiApiCommerceTradeCartcurrentPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  addItem(body: ApiApiCommerceTradeCartaddItemRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCommerceTradeCartaddItemResponseBody>(
      ApiApiCommerceTradeCartaddItemPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  clear(options?: IApiActionOptions) {
    return this.$fetch.delete<any, ApiApiCommerceTradeCartclearResponseBody>(
      ApiApiCommerceTradeCartclearPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  deleteItem(
    options: {
      params: ApiApiCommerceTradeCartdeleteItemRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.delete<any, ApiApiCommerceTradeCartdeleteItemResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeCartdeleteItemPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  updateItem(
    body: ApiApiCommerceTradeCartupdateItemRequestBody,
    options: {
      params: ApiApiCommerceTradeCartupdateItemRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.patch<any, ApiApiCommerceTradeCartupdateItemResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeCartupdateItemPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
