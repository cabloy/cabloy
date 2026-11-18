import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCabloyAiChatcreatePath,
  ApiApiCabloyAiChatlistPath,
  ApiApiCabloyAiChathistoryPath,
  ApiApiCabloyAiChatstatusPath,
  ApiApiCabloyAiChatremovePath,
} from '../api/cabloyAiChat.ts';

@ApiSchema()
export class ApiSchemaCabloyAiChat extends BeanBase {
  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCabloyAiChatcreatePath, 'post', options);
  }

  list(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCabloyAiChatlistPath, 'post', options);
  }

  history(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCabloyAiChathistoryPath, 'post', options);
  }

  status(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCabloyAiChatstatusPath, 'post', options);
  }

  remove(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCabloyAiChatremovePath, 'post', options);
  }
}
