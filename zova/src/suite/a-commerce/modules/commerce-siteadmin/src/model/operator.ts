import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsOperator extends IDecoratorModelOptions {}

@Model<IModelOptionsOperator>()
export class ModelOperator extends BeanModelBase {
  context() {
    return this.$useStateData({
      queryKey: ['operatorContext'],
      queryFn: async () => {
        return await this.scope.api.commerceSiteadminOperator.context();
      },
    });
  }
}
