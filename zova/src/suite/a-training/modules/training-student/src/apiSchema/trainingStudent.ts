import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiTrainingStudentselectPath,
  ApiApiTrainingStudentcreatePath,
  ApiApiTrainingStudentviewPath,
  ApiApiTrainingStudentdeletePath,
  ApiApiTrainingStudentupdatePath,
  ApiApiTrainingStudentsummaryPath,
  ApiApiTrainingStudentdeleteForcePath,
} from '../api/trainingStudent.js';

@ApiSchema()
export class ApiSchemaTrainingStudent extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentcreatePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentdeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentupdatePath, 'patch', options);
  }

  summary(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentsummaryPath, 'get', options);
  }

  deleteForce(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentdeleteForcePath, 'delete', options);
  }
}
