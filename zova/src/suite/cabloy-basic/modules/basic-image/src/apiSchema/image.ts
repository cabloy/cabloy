import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import { ApiApiImagecreateUploadTokenPath, ApiApiImageuploadPath } from '../api/image.js';

@ApiSchema()
export class ApiSchemaImage extends BeanBase {
  createUploadToken(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImagecreateUploadTokenPath, 'post', options);
  }

  upload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImageuploadPath, 'post', options);
  }
}
