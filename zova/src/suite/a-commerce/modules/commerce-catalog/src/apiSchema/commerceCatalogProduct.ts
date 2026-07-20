import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceCatalogProductselectPublicPath,
  ApiApiCommerceCatalogProductviewPublicPath,
} from '../api/commerceCatalogProduct.js';

@ApiSchema()
export class ApiSchemaCommerceCatalogProduct extends BeanBase {
  selectPublic(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceCatalogProductselectPublicPath, 'get', options);
  }

  viewPublic(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceCatalogProductviewPublicPath, 'get', options);
  }
}
