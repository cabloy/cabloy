import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiCommerceTradeCheckoutcreatePath } from '../api/commerceTradeCheckout.js';

@ApiSchema()
export class ApiSchemaCommerceTradeCheckout extends BeanBase {
  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCheckoutcreatePath, 'post', options);
  }
}
