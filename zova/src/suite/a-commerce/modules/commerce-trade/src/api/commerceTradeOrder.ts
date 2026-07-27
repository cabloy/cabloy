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

/** CommerceTradeOrder_refundOutcome */
export const ApiApiCommerceTradeOrderrefundOutcomePath =
  '/api/commerce/trade/order/{id}/refundOutcome';
export type ApiApiCommerceTradeOrderrefundOutcomePath =
  '/api/commerce/trade/order/{id}/refundOutcome';
export type ApiApiCommerceTradeOrderrefundOutcomeMethod = 'post';
export type ApiApiCommerceTradeOrderrefundOutcomeRequestParams =
  paths[ApiApiCommerceTradeOrderrefundOutcomePath][ApiApiCommerceTradeOrderrefundOutcomeMethod]['parameters']['path'];
export type ApiApiCommerceTradeOrderrefundOutcomeRequestBody =
  components['schemas']['commerce-trade.dto.refundOutcomeCreate'];
export type ApiApiCommerceTradeOrderrefundOutcomeResponseBody =
  paths[ApiApiCommerceTradeOrderrefundOutcomePath][ApiApiCommerceTradeOrderrefundOutcomeMethod]['responses']['200']['content']['application/json']['data'];

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

  refundOutcome(
    body: ApiApiCommerceTradeOrderrefundOutcomeRequestBody,
    options: {
      params: ApiApiCommerceTradeOrderrefundOutcomeRequestParams;
    } & IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeOrderrefundOutcomeResponseBody>(
      this.$pathTranslate(ApiApiCommerceTradeOrderrefundOutcomePath, options.params),
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
