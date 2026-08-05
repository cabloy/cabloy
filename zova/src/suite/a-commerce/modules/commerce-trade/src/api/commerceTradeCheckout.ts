import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeCheckout_paymentMethods */
export const ApiApiCommerceTradeCheckoutpaymentMethodsPath =
  '/api/commerce/trade/checkout/payment-methods';
export type ApiApiCommerceTradeCheckoutpaymentMethodsPath =
  '/api/commerce/trade/checkout/payment-methods';
export type ApiApiCommerceTradeCheckoutpaymentMethodsMethod = 'get';
export type ApiApiCommerceTradeCheckoutpaymentMethodsResponseBody =
  paths[ApiApiCommerceTradeCheckoutpaymentMethodsPath][ApiApiCommerceTradeCheckoutpaymentMethodsMethod]['responses']['200']['content']['application/json']['data'];

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
  paymentMethods(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiCommerceTradeCheckoutpaymentMethodsResponseBody>(
      ApiApiCommerceTradeCheckoutpaymentMethodsPath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  create(body: ApiApiCommerceTradeCheckoutcreateRequestBody, options?: IApiActionOptions) {
    return this.$fetch.post<any, ApiApiCommerceTradeCheckoutcreateResponseBody>(
      ApiApiCommerceTradeCheckoutcreatePath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
