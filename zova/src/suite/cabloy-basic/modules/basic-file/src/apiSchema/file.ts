import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiFilegetUploadPolicyPath,
  ApiApiFileuploadPath,
  ApiApiFilecreateDirectUploadPath,
  ApiApiFilefinalizeDirectUploadPath,
  ApiApiFileuploadUrlPath,
  ApiApiFiledownloadPath,
} from '../api/file.js';

@ApiSchema()
export class ApiSchemaFile extends BeanBase {
  getUploadPolicy(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFilegetUploadPolicyPath, 'post', options);
  }

  upload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFileuploadPath, 'post', options);
  }

  createDirectUpload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFilecreateDirectUploadPath, 'post', options);
  }

  finalizeDirectUpload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFilefinalizeDirectUploadPath, 'post', options);
  }

  uploadUrl(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFileuploadUrlPath, 'post', options);
  }

  download(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiFiledownloadPath, 'get', options);
  }
}
