import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiDemoStudentselectPath,
  ApiApiDemoStudentcreatePath,
  ApiApiDemoStudentsummaryPath,
  ApiApiDemoStudentviewPath,
  ApiApiDemoStudentdeletePath,
  ApiApiDemoStudentupdatePath,
  ApiApiDemoStudentdeleteForcePath,
} from '../api/demoStudent.js';

@ApiSchema()
export class ApiSchemaDemoStudent extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentcreatePath, 'post', options);
  }

  summary(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentsummaryPath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentdeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentupdatePath, 'patch', options);
  }

  deleteForce(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiDemoStudentdeleteForcePath, 'delete', options);
  }
}
