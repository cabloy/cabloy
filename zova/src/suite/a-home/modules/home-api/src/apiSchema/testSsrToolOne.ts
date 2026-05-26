import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiTestSsrToolOnetestGetPath,
  ApiApiTestSsrToolOnetestPath,
} from '../api/testSsrToolOne.js';

@ApiSchema()
export class ApiSchemaTestSsrToolOne extends BeanBase {
  testGet(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTestSsrToolOnetestGetPath, 'get', options);
  }

  test(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTestSsrToolOnetestPath, 'post', options);
  }
}
