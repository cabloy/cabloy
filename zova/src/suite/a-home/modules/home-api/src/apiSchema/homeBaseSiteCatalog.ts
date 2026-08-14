import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiHomeBaseSiteCatalogselectPath } from '../api/homeBaseSiteCatalog.js';

@ApiSchema()
export class ApiSchemaHomeBaseSiteCatalog extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeBaseSiteCatalogselectPath, 'get', options);
  }
}
