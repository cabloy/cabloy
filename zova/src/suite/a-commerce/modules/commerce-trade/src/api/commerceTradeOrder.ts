import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeOrder_mine */
export const ApiApiCommerceTradeOrderminePath = '/api/commerce/trade/order/mine';
export type ApiApiCommerceTradeOrderminePath = '/api/commerce/trade/order/mine';
export type ApiApiCommerceTradeOrdermineMethod = 'get';
export type ApiApiCommerceTradeOrdermineRequestQuery =
  paths[ApiApiCommerceTradeOrderminePath][ApiApiCommerceTradeOrdermineMethod]['parameters']['query'];
export type ApiApiCommerceTradeOrdermineResponseBody =
  paths[ApiApiCommerceTradeOrderminePath][ApiApiCommerceTradeOrdermineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_viewMine */
export const ApiApiCommerceTradeOrderviewMinePath = '/api/commerce/trade/order/viewMine/{id}';
export type ApiApiCommerceTradeOrderviewMinePath = '/api/commerce/trade/order/viewMine/{id}';
export type ApiApiCommerceTradeOrderviewMineMethod = 'get';
export type ApiApiCommerceTradeOrderviewMineRequestParams =
  paths[ApiApiCommerceTradeOrderviewMinePath][ApiApiCommerceTradeOrderviewMineMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderviewMineResponseBody =
  paths[ApiApiCommerceTradeOrderviewMinePath][ApiApiCommerceTradeOrderviewMineMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_select */
export const ApiApiCommerceTradeOrderselectPath = '/api/commerce/trade/order';
export type ApiApiCommerceTradeOrderselectPath = '/api/commerce/trade/order';
export type ApiApiCommerceTradeOrderselectMethod = 'get';
export type ApiApiCommerceTradeOrderselectRequestQuery =
  paths[ApiApiCommerceTradeOrderselectPath][ApiApiCommerceTradeOrderselectMethod]['parameters']['query'];
export type ApiApiCommerceTradeOrderselectResponseBody =
  paths[ApiApiCommerceTradeOrderselectPath][ApiApiCommerceTradeOrderselectMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_view */
export const ApiApiCommerceTradeOrderviewPath = '/api/commerce/trade/order/{id}';
export type ApiApiCommerceTradeOrderviewPath = '/api/commerce/trade/order/{id}';
export type ApiApiCommerceTradeOrderviewMethod = 'get';
export type ApiApiCommerceTradeOrderviewRequestParams =
  paths[ApiApiCommerceTradeOrderviewPath][ApiApiCommerceTradeOrderviewMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderviewResponseBody =
  paths[ApiApiCommerceTradeOrderviewPath][ApiApiCommerceTradeOrderviewMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceTradeOrder extends BeanApiBase {
  mine(
    options?: {
      query?: ApiApiCommerceTradeOrdermineRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrdermineResponseBody>(
      ApiApiCommerceTradeOrderminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  viewMine(
    options: {
      params: ApiApiCommerceTradeOrderviewMineRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrderviewMineResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderviewMinePath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  select(
    options?: {
      query?: ApiApiCommerceTradeOrderselectRequestQuery;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrderselectResponseBody>(
      ApiApiCommerceTradeOrderselectPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiCommerceTradeOrderviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrderviewResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
