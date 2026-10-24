import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiAuthorizationsummaryPath,
  ApiApiAuthorizationdecisionPath,
} from '../api/authorization.ts';

@ApiSchema()
export class ApiSchemaAuthorization extends BeanBase {
  summary(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAuthorizationsummaryPath, 'get', options);
  }

  decision(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiAuthorizationdecisionPath, 'post', options);
  }
}
