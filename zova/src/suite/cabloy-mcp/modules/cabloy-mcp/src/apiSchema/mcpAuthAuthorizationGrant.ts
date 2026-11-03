import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiMcpAuthAuthorizationGrantminePath,
  ApiApiMcpAuthAuthorizationGrantrevokeMinePath,
  ApiApiMcpAuthAuthorizationGrantdeleteMinePath,
} from '../api/mcpAuthAuthorizationGrant.ts';

@ApiSchema()
export class ApiSchemaMcpAuthAuthorizationGrant extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiMcpAuthAuthorizationGrantminePath, 'get', options);
  }

  revokeMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiMcpAuthAuthorizationGrantrevokeMinePath,
      'post',
      options,
    );
  }

  deleteMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiMcpAuthAuthorizationGrantdeleteMinePath,
      'delete',
      options,
    );
  }
}
