import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceTradeOrderminePath,
  ApiApiCommerceTradeOrderviewMinePath,
  ApiApiCommerceTradeOrdershipPath,
  ApiApiCommerceTradeOrderselectPath,
  ApiApiCommerceTradeOrderviewPath,
} from '../api/commerceTradeOrder.js';

@ApiSchema()
export class ApiSchemaCommerceTradeOrder extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderminePath, 'get', options);
  }

  viewMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderviewMinePath, 'get', options);
  }

  ship(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrdershipPath, 'post', options);
  }

  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderselectPath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderviewPath, 'get', options);
  }
}
