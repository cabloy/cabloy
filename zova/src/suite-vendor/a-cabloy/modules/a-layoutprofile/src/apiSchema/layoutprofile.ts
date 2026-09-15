import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiLayoutprofileloadPath,
  ApiApiLayoutprofilesavePath,
  ApiApiLayoutprofileresetPath,
} from '../api/layoutprofile.js';

@ApiSchema()
export class ApiSchemaLayoutprofile extends BeanBase {
  load(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiLayoutprofileloadPath, 'get', options);
  }

  save(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiLayoutprofilesavePath, 'post', options);
  }

  reset(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiLayoutprofileresetPath, 'delete', options);
  }
}
