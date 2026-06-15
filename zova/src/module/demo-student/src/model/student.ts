import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsStudent extends IDecoratorModelOptions {}

@Model<IModelOptionsStudent>()
export class ModelStudent extends BeanModelBase {
  async summary(id: TableIdentity) {
    return await this.scope.api.demoStudent.summary({ params: { id } });
  }

  async deleteForce(id: TableIdentity) {
    await this.scope.api.demoStudent.deleteForce({ params: { id } });
    await this.$invalidateQueries({ queryKey: ['list'] });
    await this.$invalidateQueries({ queryKey: ['item', id] });
  }
}
