import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** PayPaymentSession_start */
export const ApiApiPayPaymentSessionstartPath = '/api/pay/payment-session/{id}/start';
export type ApiApiPayPaymentSessionstartPath = '/api/pay/payment-session/{id}/start';
export type ApiApiPayPaymentSessionstartMethod = 'post';
export type ApiApiPayPaymentSessionstartRequestParams =
  paths[ApiApiPayPaymentSessionstartPath][ApiApiPayPaymentSessionstartMethod]['parameters']['path'];
export type ApiApiPayPaymentSessionstartResponseBody =
  paths[ApiApiPayPaymentSessionstartPath][ApiApiPayPaymentSessionstartMethod]['responses']['200']['content']['application/json']['data'];

/** PayPaymentSession_reconcile */
export const ApiApiPayPaymentSessionreconcilePath = '/api/pay/payment-session/{id}/reconcile';
export type ApiApiPayPaymentSessionreconcilePath = '/api/pay/payment-session/{id}/reconcile';
export type ApiApiPayPaymentSessionreconcileMethod = 'post';
export type ApiApiPayPaymentSessionreconcileRequestParams =
  paths[ApiApiPayPaymentSessionreconcilePath][ApiApiPayPaymentSessionreconcileMethod]['parameters']['path'];
export type ApiApiPayPaymentSessionreconcileResponseBody =
  paths[ApiApiPayPaymentSessionreconcilePath][ApiApiPayPaymentSessionreconcileMethod]['responses']['200']['content']['application/json']['data'];

/** PayPaymentSession_view */
export const ApiApiPayPaymentSessionviewPath = '/api/pay/payment-session/{id}';
export type ApiApiPayPaymentSessionviewPath = '/api/pay/payment-session/{id}';
export type ApiApiPayPaymentSessionviewMethod = 'get';
export type ApiApiPayPaymentSessionviewRequestParams =
  paths[ApiApiPayPaymentSessionviewPath][ApiApiPayPaymentSessionviewMethod]['parameters']['path'];
export type ApiApiPayPaymentSessionviewResponseBody =
  paths[ApiApiPayPaymentSessionviewPath][ApiApiPayPaymentSessionviewMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiPayPaymentSession extends BeanApiBase {
  start(
    body: undefined,
    options: {
      params: ApiApiPayPaymentSessionstartRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPayPaymentSessionstartResponseBody>(
      this.$pathTranslate(ApiApiPayPaymentSessionstartPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  reconcile(
    body: undefined,
    options: {
      params: ApiApiPayPaymentSessionreconcileRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiPayPaymentSessionreconcileResponseBody>(
      this.$pathTranslate(ApiApiPayPaymentSessionreconcilePath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  view(
    options: {
      params: ApiApiPayPaymentSessionviewRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiPayPaymentSessionviewResponseBody>(
      this.$pathTranslate(ApiApiPayPaymentSessionviewPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
