import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import { ApiApiHomeBaseMenuretrieveMenusPath } from '../api/homeBaseMenu.js';

@ApiSchema()
export class ApiSchemaHomeBaseMenu extends BeanBase {
  retrieveMenus(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeBaseMenuretrieveMenusPath, 'get', options);
  }
}
