import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiCommerceTradeStockBalanceadjustStockPath } from '../api/commerceTradeStockBalance.js';

@ApiSchema()
export class ApiSchemaCommerceTradeStockBalance extends BeanBase {
  adjustStock(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiCommerceTradeStockBalanceadjustStockPath,
      'post',
      options,
    );
  }
}
