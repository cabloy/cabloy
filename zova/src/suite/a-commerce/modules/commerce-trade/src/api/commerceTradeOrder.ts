import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

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

/** CommerceTradeOrder_requestRefund */
export const ApiApiCommerceTradeOrderrequestRefundPath =
  '/api/commerce/trade/order/{id}/requestRefund';
export type ApiApiCommerceTradeOrderrequestRefundPath =
  '/api/commerce/trade/order/{id}/requestRefund';
export type ApiApiCommerceTradeOrderrequestRefundMethod = 'post';
export type ApiApiCommerceTradeOrderrequestRefundRequestParams =
  paths[ApiApiCommerceTradeOrderrequestRefundPath][ApiApiCommerceTradeOrderrequestRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderrequestRefundRequestBody =
  components['schemas']['commerce-trade.dto.refundRequestCreate'];
export type ApiApiCommerceTradeOrderrequestRefundResponseBody =
  paths[ApiApiCommerceTradeOrderrequestRefundPath][ApiApiCommerceTradeOrderrequestRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_approveRefund */
export const ApiApiCommerceTradeOrderapproveRefundPath =
  '/api/commerce/trade/order/{id}/approveRefund';
export type ApiApiCommerceTradeOrderapproveRefundPath =
  '/api/commerce/trade/order/{id}/approveRefund';
export type ApiApiCommerceTradeOrderapproveRefundMethod = 'post';
export type ApiApiCommerceTradeOrderapproveRefundRequestParams =
  paths[ApiApiCommerceTradeOrderapproveRefundPath][ApiApiCommerceTradeOrderapproveRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderapproveRefundRequestBody =
  components['schemas']['commerce-trade.dto.refundReview'];
export type ApiApiCommerceTradeOrderapproveRefundResponseBody =
  paths[ApiApiCommerceTradeOrderapproveRefundPath][ApiApiCommerceTradeOrderapproveRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_rejectRefund */
export const ApiApiCommerceTradeOrderrejectRefundPath =
  '/api/commerce/trade/order/{id}/rejectRefund';
export type ApiApiCommerceTradeOrderrejectRefundPath =
  '/api/commerce/trade/order/{id}/rejectRefund';
export type ApiApiCommerceTradeOrderrejectRefundMethod = 'post';
export type ApiApiCommerceTradeOrderrejectRefundRequestParams =
  paths[ApiApiCommerceTradeOrderrejectRefundPath][ApiApiCommerceTradeOrderrejectRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderrejectRefundRequestBody =
  components['schemas']['commerce-trade.dto.refundReview'];
export type ApiApiCommerceTradeOrderrejectRefundResponseBody =
  paths[ApiApiCommerceTradeOrderrejectRefundPath][ApiApiCommerceTradeOrderrejectRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_executeRefund */
export const ApiApiCommerceTradeOrderexecuteRefundPath =
  '/api/commerce/trade/order/{id}/executeRefund';
export type ApiApiCommerceTradeOrderexecuteRefundPath =
  '/api/commerce/trade/order/{id}/executeRefund';
export type ApiApiCommerceTradeOrderexecuteRefundMethod = 'post';
export type ApiApiCommerceTradeOrderexecuteRefundRequestParams =
  paths[ApiApiCommerceTradeOrderexecuteRefundPath][ApiApiCommerceTradeOrderexecuteRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderexecuteRefundResponseBody =
  paths[ApiApiCommerceTradeOrderexecuteRefundPath][ApiApiCommerceTradeOrderexecuteRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_refundRecovery */
export const ApiApiCommerceTradeOrderrefundRecoveryPath =
  '/api/commerce/trade/order/{id}/refundRecovery';
export type ApiApiCommerceTradeOrderrefundRecoveryPath =
  '/api/commerce/trade/order/{id}/refundRecovery';
export type ApiApiCommerceTradeOrderrefundRecoveryMethod = 'get';
export type ApiApiCommerceTradeOrderrefundRecoveryRequestParams =
  paths[ApiApiCommerceTradeOrderrefundRecoveryPath][ApiApiCommerceTradeOrderrefundRecoveryMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderrefundRecoveryResponseBody =
  paths[ApiApiCommerceTradeOrderrefundRecoveryPath][ApiApiCommerceTradeOrderrefundRecoveryMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_reconcileRefund */
export const ApiApiCommerceTradeOrderreconcileRefundPath =
  '/api/commerce/trade/order/{id}/reconcileRefund';
export type ApiApiCommerceTradeOrderreconcileRefundPath =
  '/api/commerce/trade/order/{id}/reconcileRefund';
export type ApiApiCommerceTradeOrderreconcileRefundMethod = 'post';
export type ApiApiCommerceTradeOrderreconcileRefundRequestParams =
  paths[ApiApiCommerceTradeOrderreconcileRefundPath][ApiApiCommerceTradeOrderreconcileRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderreconcileRefundRequestBody =
  components['schemas']['commerce-trade.dto.refundRecoveryAction'];
export type ApiApiCommerceTradeOrderreconcileRefundResponseBody =
  paths[ApiApiCommerceTradeOrderreconcileRefundPath][ApiApiCommerceTradeOrderreconcileRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_retryRefund */
export const ApiApiCommerceTradeOrderretryRefundPath = '/api/commerce/trade/order/{id}/retryRefund';
export type ApiApiCommerceTradeOrderretryRefundPath = '/api/commerce/trade/order/{id}/retryRefund';
export type ApiApiCommerceTradeOrderretryRefundMethod = 'post';
export type ApiApiCommerceTradeOrderretryRefundRequestParams =
  paths[ApiApiCommerceTradeOrderretryRefundPath][ApiApiCommerceTradeOrderretryRefundMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderretryRefundRequestBody =
  components['schemas']['commerce-trade.dto.refundRecoveryAction'];
export type ApiApiCommerceTradeOrderretryRefundResponseBody =
  paths[ApiApiCommerceTradeOrderretryRefundPath][ApiApiCommerceTradeOrderretryRefundMethod]['responses']['200']['content']['application/json']['data'];

/** CommerceTradeOrder_ship */
export const ApiApiCommerceTradeOrdershipPath = '/api/commerce/trade/order/{id}/ship';
export type ApiApiCommerceTradeOrdershipPath = '/api/commerce/trade/order/{id}/ship';
export type ApiApiCommerceTradeOrdershipMethod = 'post';
export type ApiApiCommerceTradeOrdershipRequestParams =
  paths[ApiApiCommerceTradeOrdershipPath][ApiApiCommerceTradeOrdershipMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrdershipRequestBody =
  components['schemas']['commerce-trade.dto.orderShip'];
export type ApiApiCommerceTradeOrdershipResponseBody =
  paths[ApiApiCommerceTradeOrdershipPath][ApiApiCommerceTradeOrdershipMethod]['responses']['200']['content']['application/json']['data'];

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

  requestRefund(
    body: ApiApiCommerceTradeOrderrequestRefundRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderrequestRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderrequestRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderrequestRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  approveRefund(
    body: ApiApiCommerceTradeOrderapproveRefundRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderapproveRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderapproveRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderapproveRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  rejectRefund(
    body: ApiApiCommerceTradeOrderrejectRefundRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderrejectRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderrejectRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderrejectRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  executeRefund(
    body: undefined,
    options: {
      params: ApiApiCommerceTradeOrderexecuteRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderexecuteRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderexecuteRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  refundRecovery(
    options: {
      params: ApiApiCommerceTradeOrderrefundRecoveryRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.get<any, ApiApiCommerceTradeOrderrefundRecoveryResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderrefundRecoveryPath, options.params),
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  reconcileRefund(
    body: ApiApiCommerceTradeOrderreconcileRefundRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderreconcileRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderreconcileRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderreconcileRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  retryRefund(
    body: ApiApiCommerceTradeOrderretryRefundRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderretryRefundRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderretryRefundResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderretryRefundPath, options.params),
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }

  ship(
    body: ApiApiCommerceTradeOrdershipRequestBody,
    options: {
      params: ApiApiCommerceTradeOrdershipRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrdershipResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrdershipPath, options.params),
      body,
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
