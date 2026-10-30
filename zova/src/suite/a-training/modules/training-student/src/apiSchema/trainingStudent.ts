import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiTrainingStudentselectPath,
  ApiApiTrainingStudentcreatePath,
  ApiApiTrainingStudentgroupPath,
  ApiApiTrainingStudentaggregatePath,
  ApiApiTrainingStudentviewPath,
  ApiApiTrainingStudentdeletePath,
  ApiApiTrainingStudentupdatePath,
  ApiApiTrainingStudentsummaryPath,
  ApiApiTrainingStudentdeleteBulkPath,
  ApiApiTrainingStudentdeleteForcePath,
} from '../api/trainingStudent.ts';

@ApiSchema()
export class ApiSchemaTrainingStudent extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentcreatePath, 'post', options);
  }

  group(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentgroupPath, 'get', options);
  }

  aggregate(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentaggregatePath, 'get', options);
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

  deleteBulk(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentdeleteBulkPath, 'post', options);
  }

  deleteForce(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiTrainingStudentdeleteForcePath, 'delete', options);
  }
}
