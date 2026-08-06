import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** PaymentSession_start */
export const ApiApiPaymentSessionstartPath = '/api/pay/payment-session/{id}/start';
export type ApiApiPaymentSessionstartPath = '/api/pay/payment-session/{id}/start';
export type ApiApiPaymentSessionstartMethod = 'post';
export type ApiApiPaymentSessionstartRequestParams =
  paths[ApiApiPaymentSessionstartPath][ApiApiPaymentSessionstartMethod]['parameters']['path'];
export type ApiApiPaymentSessionstartResponseBody =
  paths[ApiApiPaymentSessionstartPath][ApiApiPaymentSessionstartMethod]['responses']['200']['content']['application/json']['data'];

/** PaymentSession_reconcile */
export const ApiApiPaymentSessionreconcilePath = '/api/pay/payment-session/{id}/reconcile';
export type ApiApiPaymentSessionreconcilePath = '/api/pay/payment-session/{id}/reconcile';
export type ApiApiPaymentSessionreconcileMethod = 'post';
export type ApiApiPaymentSessionreconcileRequestParams =
  paths[ApiApiPaymentSessionreconcilePath][ApiApiPaymentSessionreconcileMethod]['parameters']['path'];
export type ApiApiPaymentSessionreconcileResponseBody =
  paths[ApiApiPaymentSessionreconcilePath][ApiApiPaymentSessionreconcileMethod]['responses']['200']['content']['application/json']['data'];

/** PaymentSession_view */
export const ApiApiPaymentSessionviewPath = '/api/pay/payment-session/{id}';
export type ApiApiPaymentSessionviewPath = '/api/pay/payment-session/{id}';
export type ApiApiPaymentSessionviewMethod = 'get';
export type ApiApiPaymentSessionviewRequestParams =
  paths[ApiApiPaymentSessionviewPath][ApiApiPaymentSessionviewMethod]['parameters']['path'];
export type ApiApiPaymentSessionviewResponseBody =
  paths[ApiApiPaymentSessionviewPath][ApiApiPaymentSessionviewMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiPaymentSession extends BeanApiBase {
  start(
    body: undefined,
    options: {
      params: ApiApiPaymentSessionstartRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPaymentSessionstartResponseBody>(
      this.$pathTranslate(ApiApiPaymentSessionstartPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  reconcile(
    body: undefined,
    options: {
      params: ApiApiPaymentSessionreconcileRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPaymentSessionreconcileResponseBody>(
      this.$pathTranslate(ApiApiPaymentSessionreconcilePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiPaymentSessionviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiPaymentSessionviewResponseBody>(
      this.$pathTranslate(ApiApiPaymentSessionviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
