import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiPaymentSessionstartPath,
  ApiApiPaymentSessionreconcilePath,
  ApiApiPaymentSessionviewPath,
} from '../api/paymentSession.js';

@ApiSchema()
export class ApiSchemaPaymentSession extends BeanBase {
  start(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaymentSessionstartPath, 'post', options);
  }

  reconcile(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaymentSessionreconcilePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPaymentSessionviewPath, 'get', options);
  }
}
