import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiPayPaymentSessionstartPath,
  ApiApiPayPaymentSessionreconcilePath,
  ApiApiPayPaymentSessionviewPath,
} from '../api/payPaymentSession.js';

@ApiSchema()
export class ApiSchemaPayPaymentSession extends BeanBase {
  start(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayPaymentSessionstartPath, 'post', options);
  }

  reconcile(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayPaymentSessionreconcilePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiPayPaymentSessionviewPath, 'get', options);
  }
}
