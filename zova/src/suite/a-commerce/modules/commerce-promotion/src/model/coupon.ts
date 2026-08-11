import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsCoupon extends IDecoratorModelOptions {}

@Model<IModelOptionsCoupon>()
export class ModelCoupon extends BeanModelBase {
  mine() {
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['mine'],
      queryFn: async () => {
        return await this.scope.api.commercePromotionCoupon.mine();
      },
    });
  }
}
