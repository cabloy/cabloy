import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** PayMockMockPayment_complete */
export const ApiApiPayMockMockPaymentcompletePath = '/api/pay/mock/payment-session/{id}/complete';
export type ApiApiPayMockMockPaymentcompletePath = '/api/pay/mock/payment-session/{id}/complete';
export type ApiApiPayMockMockPaymentcompleteMethod = 'post';
export type ApiApiPayMockMockPaymentcompleteRequestParams =
  paths[ApiApiPayMockMockPaymentcompletePath][ApiApiPayMockMockPaymentcompleteMethod]['parameters']['path'];
export type ApiApiPayMockMockPaymentcompleteRequestBody =
  components['schemas']['pay-mock.dto.mockPaymentComplete'];
export type ApiApiPayMockMockPaymentcompleteResponseBody =
  paths[ApiApiPayMockMockPaymentcompletePath][ApiApiPayMockMockPaymentcompleteMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiPayMockMockPayment extends BeanApiBase {
  complete(
    body: ApiApiPayMockMockPaymentcompleteRequestBody,
    options: {
      params: ApiApiPayMockMockPaymentcompleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPayMockMockPaymentcompleteResponseBody>(
      this.$pathTranslate(ApiApiPayMockMockPaymentcompletePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
