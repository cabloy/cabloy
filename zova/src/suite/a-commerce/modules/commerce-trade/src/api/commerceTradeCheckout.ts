import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeCheckout_create */
export const ApiApiCommerceTradeCheckoutcreatePath = '/api/commerce/trade/checkout';
export type ApiApiCommerceTradeCheckoutcreatePath = '/api/commerce/trade/checkout';
export type ApiApiCommerceTradeCheckoutcreateMethod = 'post';
export type ApiApiCommerceTradeCheckoutcreateRequestBody =
  components['schemas']['commerce-trade.dto.checkoutCreate'];
export type ApiApiCommerceTradeCheckoutcreateResponseBody =
  paths[ApiApiCommerceTradeCheckoutcreatePath][ApiApiCommerceTradeCheckoutcreateMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceTradeCheckout extends BeanApiBase {
  create(body: ApiApiCommerceTradeCheckoutcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCommerceTradeCheckoutcreateResponseBody>(
      ApiApiCommerceTradeCheckoutcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
