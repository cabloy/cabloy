import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** PayMockPayment_complete */
export const ApiApiPayMockPaymentcompletePath = '/api/pay/mock/payment-session/{id}/complete';
export type ApiApiPayMockPaymentcompletePath = '/api/pay/mock/payment-session/{id}/complete';
export type ApiApiPayMockPaymentcompleteMethod = 'post';
export type ApiApiPayMockPaymentcompleteRequestParams =
  paths[ApiApiPayMockPaymentcompletePath][ApiApiPayMockPaymentcompleteMethod]['parameters']['path'];
export type ApiApiPayMockPaymentcompleteRequestBody =
  components['schemas']['pay-mock.dto.mockPaymentComplete'];
export type ApiApiPayMockPaymentcompleteResponseBody =
  paths[ApiApiPayMockPaymentcompletePath][ApiApiPayMockPaymentcompleteMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiPayMockPayment extends BeanApiBase {
  complete(
    body: ApiApiPayMockPaymentcompleteRequestBody,
    options: {
      params: ApiApiPayMockPaymentcompleteRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPayMockPaymentcompleteResponseBody>(
      this.$pathTranslate(ApiApiPayMockPaymentcompletePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
