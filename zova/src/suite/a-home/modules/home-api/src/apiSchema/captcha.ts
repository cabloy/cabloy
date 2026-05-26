import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiCaptchacreatePath,
  ApiApiCaptcharefreshPath,
  ApiApiCaptchaverifyImmediatePath,
} from '../api/captcha.js';

@ApiSchema()
export class ApiSchemaCaptcha extends BeanBase {
  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCaptchacreatePath, 'post', options);
  }

  refresh(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCaptcharefreshPath, 'post', options);
  }

  verifyImmediate(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCaptchaverifyImmediatePath, 'post', options);
  }
}
