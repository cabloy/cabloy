import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradePayment_outcome */
export const ApiApiCommerceTradePaymentoutcomePath =
  '/api/commerce/trade/payment/{attemptId}/outcome';
export type ApiApiCommerceTradePaymentoutcomePath =
  '/api/commerce/trade/payment/{attemptId}/outcome';
export type ApiApiCommerceTradePaymentoutcomeMethod = 'post';
export type ApiApiCommerceTradePaymentoutcomeRequestParams =
  paths[ApiApiCommerceTradePaymentoutcomePath][ApiApiCommerceTradePaymentoutcomeMethod]['parameters']['path'];
export type ApiApiCommerceTradePaymentoutcomeRequestBody =
  components['schemas']['commerce-trade.dto.paymentOutcomeCreate'];
export type ApiApiCommerceTradePaymentoutcomeResponseBody =
  paths[ApiApiCommerceTradePaymentoutcomePath][ApiApiCommerceTradePaymentoutcomeMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceTradePayment extends BeanApiBase {
  outcome(
    body: ApiApiCommerceTradePaymentoutcomeRequestBody,
    options: {
      params: ApiApiCommerceTradePaymentoutcomeRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradePaymentoutcomeResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradePaymentoutcomePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
