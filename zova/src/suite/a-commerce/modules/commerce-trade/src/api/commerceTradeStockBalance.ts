import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { components, paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommerceTradeStockBalance_adjustStock */
export const ApiApiCommerceTradeStockBalanceadjustStockPath =
  '/api/commerce/trade/stockBalance/adjustStock';
export type ApiApiCommerceTradeStockBalanceadjustStockPath =
  '/api/commerce/trade/stockBalance/adjustStock';
export type ApiApiCommerceTradeStockBalanceadjustStockMethod = 'post';
export type ApiApiCommerceTradeStockBalanceadjustStockRequestBody =
  components['schemas']['commerce-trade.dto.stockAdjust_6a7c2f0bb21a25da3048650f263577ae4467750e'];
export type ApiApiCommerceTradeStockBalanceadjustStockResponseBody =
  paths[ApiApiCommerceTradeStockBalanceadjustStockPath][ApiApiCommerceTradeStockBalanceadjustStockMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommerceTradeStockBalance extends BeanApiBase {
  adjustStock(
    body: ApiApiCommerceTradeStockBalanceadjustStockRequestBody,
    options?: IApiActionOptions,
  ) {
    return this.$fetch.post<any, ApiApiCommerceTradeStockBalanceadjustStockResponseBody>(
      ApiApiCommerceTradeStockBalanceadjustStockPath,
      body,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
