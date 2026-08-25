import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiPayMockMockPaymentcompletePath,
  ApiApiPayMockMockPaymentcompleteRefundPath,
} from '../api/payMockMockPayment.js';

@ApiSchema()
export class ApiSchemaPayMockMockPayment extends BeanBase {
  complete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayMockMockPaymentcompletePath, 'post', options);
  }

  completeRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayMockMockPaymentcompleteRefundPath, 'post', options);
  }
}
