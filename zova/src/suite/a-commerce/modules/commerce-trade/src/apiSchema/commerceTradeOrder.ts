import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceTradeOrderminePath,
  ApiApiCommerceTradeOrderviewPath,
} from '../api/commerceTradeOrder.js';

@ApiSchema()
export class ApiSchemaCommerceTradeOrder extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderminePath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderviewPath, 'get', options);
  }
}
