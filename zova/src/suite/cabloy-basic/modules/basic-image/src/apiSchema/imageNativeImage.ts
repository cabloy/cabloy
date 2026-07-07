import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import { ApiApiImageNativeImagedirectUploadPath } from '../api/imageNativeImage.js';

@ApiSchema()
export class ApiSchemaImageNativeImage extends BeanBase {
  directUpload(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiImageNativeImagedirectUploadPath, 'post', options);
  }
}
