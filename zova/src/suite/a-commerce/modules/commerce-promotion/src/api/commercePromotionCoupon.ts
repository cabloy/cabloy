import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

import type { paths } from './openapi/index.js';

import { OpenApiBaseURL } from './openapi/index.js';

/** CommercePromotionCoupon_mine */
export const ApiApiCommercePromotionCouponminePath = '/api/commerce/promotion/coupon/mine';
export type ApiApiCommercePromotionCouponminePath = '/api/commerce/promotion/coupon/mine';
export type ApiApiCommercePromotionCouponmineMethod = 'get';
export type ApiApiCommercePromotionCouponmineResponseBody =
  paths[ApiApiCommercePromotionCouponminePath][ApiApiCommercePromotionCouponmineMethod]['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiCommercePromotionCoupon extends BeanApiBase {
  mine(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiCommercePromotionCouponmineResponseBody>(
      ApiApiCommercePromotionCouponminePath,
      this.$configPrepare(OpenApiBaseURL(this.sys), options, true),
    );
  }
}
