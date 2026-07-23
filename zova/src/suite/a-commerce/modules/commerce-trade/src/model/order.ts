import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsOrder extends IDecoratorModelOptions {}

@Model<IModelOptionsOrder>()
export class ModelOrder extends BeanModelBase {
  mine() {
    if (!process.env.CLIENT || !this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['mine'],
      queryFn: async () => {
        return await this.scope.api.commerceTradeOrder.mine();
      },
      meta: { disableSuspenseOnInit: true },
    });
  }

  view(id: string) {
    if (!process.env.CLIENT || !this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['view', id],
      queryFn: async () => {
        return await this.scope.api.commerceTradeOrder.view({ params: { id } });
      },
      meta: { disableSuspenseOnInit: true },
    });
  }
}
