import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiDemoStudentdeleteForceResponseBody,
  ApiApiDemoStudentsummaryResponseBody,
} from '../api/demoStudent.js';
import { ModelResource } from 'zova-module-rest-resource';

export interface IModelOptionsStudent extends IDecoratorModelOptions {}

@Model<IModelOptionsStudent>()
export class ModelStudent extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg('demo-student:student', true);
  }

  summary(id: TableIdentity) {
    return this.$$modelResource.queryItem<ApiApiDemoStudentsummaryResponseBody | null>({
      id,
      action: 'summary',
      queryFn: async () => {
        const data = await this.scope.api.demoStudent.summary({ params: { id } });
        return data ?? null;
      },
    });
  }

  deleteForce(id: TableIdentity) {
    return this.$$modelResource.mutationItem<ApiApiDemoStudentdeleteForceResponseBody, void>({
      id,
      action: 'deleteForce',
      mutationFn: async () => {
        return this.scope.api.demoStudent.deleteForce({ params: { id } });
      },
      invalidateSelect: true,
    });
  }
}
