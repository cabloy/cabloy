import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeOrder_mine */
export const ApiApiCommerceTradeOrderminePath = '/api/commerce/trade/order/mine';
export type ApiApiCommerceTradeOrderminePath = '/api/commerce/trade/order/mine';
export type ApiApiCommerceTradeOrdermineMethod = 'get';
export type ApiApiCommerceTradeOrdermineResponseBody =
  paths[ApiApiCommerceTradeOrderminePath][ApiApiCommerceTradeOrdermineMethod]['responses']['200']['content']['application/json']['data'];

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
  mine(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrdermineResponseBody>(
      ApiApiCommerceTradeOrderminePath,
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
