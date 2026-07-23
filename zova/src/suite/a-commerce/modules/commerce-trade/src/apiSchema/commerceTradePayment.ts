import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiCommerceTradePaymentoutcomePath } from '../api/commerceTradePayment.js';

@ApiSchema()
export class ApiSchemaCommerceTradePayment extends BeanBase {
  outcome(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradePaymentoutcomePath, 'post', options);
  }
}
