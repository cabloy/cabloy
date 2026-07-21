import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCart } from '../entity/cart.tsx';

export interface IModelOptionsCart extends IDecoratorModelOptions<EntityCart> {}

@Model<IModelOptionsCart>({
  entity: EntityCart,
  relations: {
    items: $relation.hasMany('commerce-trade:cartItem', 'cartId', {
      columns: ['id', 'skuId', 'quantity'],
    }),
  },
})
export class ModelCart extends BeanModelBase<EntityCart> {}
