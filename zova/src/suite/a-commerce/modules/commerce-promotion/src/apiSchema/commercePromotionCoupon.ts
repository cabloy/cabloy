import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiCommercePromotionCouponminePath } from '../api/commercePromotionCoupon.js';

@ApiSchema()
export class ApiSchemaCommercePromotionCoupon extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommercePromotionCouponminePath, 'get', options);
  }
}
