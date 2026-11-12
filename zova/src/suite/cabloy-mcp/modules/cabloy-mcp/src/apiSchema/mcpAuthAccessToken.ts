import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiMcpAuthAccessTokenminePath,
  ApiApiMcpAuthAccessTokencreateMinePath,
  ApiApiMcpAuthAccessTokendeleteMinePath,
} from '../api/mcpAuthAccessToken.ts';

@ApiSchema()
export class ApiSchemaMcpAuthAccessToken extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthAccessTokenminePath, 'get', options);
  }

  createMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthAccessTokencreateMinePath, 'post', options);
  }

  deleteMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthAccessTokendeleteMinePath, 'delete', options);
  }
}
