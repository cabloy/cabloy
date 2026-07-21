import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceTradeCartcurrentPath,
  ApiApiCommerceTradeCartaddItemPath,
  ApiApiCommerceTradeCartclearPath,
  ApiApiCommerceTradeCartdeleteItemPath,
  ApiApiCommerceTradeCartupdateItemPath,
} from '../api/commerceTradeCart.js';

@ApiSchema()
export class ApiSchemaCommerceTradeCart extends BeanBase {
  current(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCartcurrentPath, 'get', options);
  }

  addItem(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCartaddItemPath, 'post', options);
  }

  clear(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCartclearPath, 'delete', options);
  }

  deleteItem(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCartdeleteItemPath, 'delete', options);
  }

  updateItem(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeCartupdateItemPath, 'patch', options);
  }
}
