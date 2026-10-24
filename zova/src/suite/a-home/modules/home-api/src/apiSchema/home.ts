import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiHomeindexPath } from '../api/home.ts';

@ApiSchema()
export class ApiSchemaHome extends BeanBase {
  index(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeindexPath, 'get', options);
  }
}
