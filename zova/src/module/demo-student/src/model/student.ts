import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsStudent extends IDecoratorModelOptions {}

const StudentResource = 'demo-student:student';

@Model<IModelOptionsStudent>()
export class ModelStudent extends BeanModelBase {
  summary(id: TableIdentity) {
    return this.$$modelResource.queryItem({
      id,
      action: 'summary',
      queryFn: async () => {
        const res = await this.scope.api.demoStudent.summary({ params: { id } });
        return res ?? null;
      },
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }

  deleteForce(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'deleteForce',
      mutationFn: async () => {
        await this.scope.api.demoStudent.deleteForce({ params: { id } });
      },
    });
  }

  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(StudentResource, true);
  }
}
