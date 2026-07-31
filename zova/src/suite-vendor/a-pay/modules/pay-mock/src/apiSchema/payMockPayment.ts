import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiPayMockPaymentcompletePath } from '../api/payMockPayment.js';

@ApiSchema()
export class ApiSchemaPayMockPayment extends BeanBase {
  complete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayMockPaymentcompletePath, 'post', options);
  }
}
