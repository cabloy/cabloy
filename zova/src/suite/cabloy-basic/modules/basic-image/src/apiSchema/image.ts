import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiImagecreateUploadTokenPath,
  ApiApiImageuploadPath,
  ApiApiImagecreateDirectUploadPath,
  ApiApiImageuploadUrlPath,
  ApiApiImagedeliveryPath,
} from '../api/image.js';

@ApiSchema()
export class ApiSchemaImage extends BeanBase {
  createUploadToken(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImagecreateUploadTokenPath, 'post', options);
  }

  upload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImageuploadPath, 'post', options);
  }

  createDirectUpload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImagecreateDirectUploadPath, 'post', options);
  }

  uploadUrl(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImageuploadUrlPath, 'post', options);
  }

  delivery(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImagedeliveryPath, 'get', options);
  }
}
