// eslint-disable
/** model: begin */
export * from '../model/coupon.js';
import { IModelOptionsCoupon } from '../model/coupon.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'commerce-promotion:coupon': IModelOptionsCoupon;
    }


}
declare module 'zova-module-commerce-promotion' {

        export interface ModelCoupon {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

        export interface ModelCoupon {
          get $beanFullName(): 'commerce-promotion.model.coupon';
          get $onionName(): 'commerce-promotion:coupon';
          get $onionOptions(): IModelOptionsCoupon;
        }
}
/** model: end */
/** model: begin */
import { ModelCoupon } from '../model/coupon.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-promotion.model.coupon': ModelCoupon;
  }
}
/** model: end */
/** api: begin */
export * from '../api/commercePromotionCoupon.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-commerce-promotion' {

        export interface ApiCommercePromotionCoupon {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

        export interface ApiCommercePromotionCoupon {
          get $beanFullName(): 'commerce-promotion.api.commercePromotionCoupon';
          get $onionName(): 'commerce-promotion:commercePromotionCoupon';

        }
}
/** api: end */
/** api: begin */
import { ApiCommercePromotionCoupon } from '../api/commercePromotionCoupon.js';
export interface IModuleApi {
  'commercePromotionCoupon': ApiCommercePromotionCoupon;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-promotion.api.commercePromotionCoupon': ApiCommercePromotionCoupon;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/commercePromotionCoupon.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-commerce-promotion' {

        export interface ApiSchemaCommercePromotionCoupon {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

        export interface ApiSchemaCommercePromotionCoupon {
          get $beanFullName(): 'commerce-promotion.apiSchema.commercePromotionCoupon';
          get $onionName(): 'commerce-promotion:commercePromotionCoupon';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import { ApiSchemaCommercePromotionCoupon } from '../apiSchema/commercePromotionCoupon.js';
export interface IModuleApiSchema {
  'commercePromotionCoupon': ApiSchemaCommercePromotionCoupon;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'commerce-promotion.apiSchema.commercePromotionCoupon': ApiSchemaCommercePromotionCoupon;
  }
}
/** apiSchema: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCommercePromotion extends BeanScopeBase {}

export interface ScopeModuleCommercePromotion {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'commerce-promotion': ScopeModuleCommercePromotion;
  }






}

/** scope: end */
