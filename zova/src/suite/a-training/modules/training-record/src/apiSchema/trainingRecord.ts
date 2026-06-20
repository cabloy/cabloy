import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiTrainingRecordselectPath,
  ApiApiTrainingRecordcreatePath,
  ApiApiTrainingRecordviewPath,
  ApiApiTrainingRecorddeletePath,
  ApiApiTrainingRecordupdatePath,
} from '../api/trainingRecord.js';

@ApiSchema()
export class ApiSchemaTrainingRecord extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingRecordselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingRecordcreatePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingRecordviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingRecorddeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingRecordupdatePath, 'patch', options);
  }
}
