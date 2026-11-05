import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiMcpAuthCustomScopeminePath,
  ApiApiMcpAuthCustomScopecatalogPath,
  ApiApiMcpAuthCustomScopecreateMinePath,
  ApiApiMcpAuthCustomScopeupdateMinePath,
  ApiApiMcpAuthCustomScopedeleteMinePath,
} from '../api/mcpAuthCustomScope.ts';

@ApiSchema()
export class ApiSchemaMcpAuthCustomScope extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthCustomScopeminePath, 'get', options);
  }

  catalog(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthCustomScopecatalogPath, 'get', options);
  }

  createMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthCustomScopecreateMinePath, 'post', options);
  }

  updateMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthCustomScopeupdateMinePath, 'post', options);
  }

  deleteMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthCustomScopedeleteMinePath, 'delete', options);
  }
}
