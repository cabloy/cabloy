import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiHomeBasePermissionretrievePermissionsPath } from '../api/homeBasePermission.js';

@ApiSchema()
export class ApiSchemaHomeBasePermission extends BeanBase {
  retrievePermissions(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeBasePermissionretrievePermissionsPath,
      'get',
      options,
    );
  }
}
