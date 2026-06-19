import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';
import { ModelResource } from 'zova-module-rest-resource';

export interface IModelOptionsStudent extends IDecoratorModelOptions {}

@Model<IModelOptionsStudent>()
export class ModelStudent extends BeanModelBase {
  private $$modelResource: ModelResource;

  protected async __init__() {
    this.$$modelResource = await this.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      'demo-student:student',
    );
  }

  async summary(id: TableIdentity) {
    return (await this.scope.api.demoStudent.summary(id)) ?? null;
  }

  deleteForce(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'deleteForce',
      mutationFn: async () => {
        return await this.scope.api.demoStudent.deleteForce(id);
      },
    });
  }
}
