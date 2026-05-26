import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import { ApiApiHomeindexPath } from '../api/home.js';

@ApiSchema()
export class ApiSchemaHome extends BeanBase {
  index(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeindexPath, 'get', options);
  }
}
