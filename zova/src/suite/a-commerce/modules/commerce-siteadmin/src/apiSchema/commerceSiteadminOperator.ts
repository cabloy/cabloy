import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiCommerceSiteadminOperatorcontextPath } from '../api/commerceSiteadminOperator.js';

@ApiSchema()
export class ApiSchemaCommerceSiteadminOperator extends BeanBase {
  context(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceSiteadminOperatorcontextPath, 'get', options);
  }
}
