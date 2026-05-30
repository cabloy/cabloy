import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrder } from '../entity/order.ts';
import { ModelProduct } from './product.ts';

export interface IModelOptionsOrderStats extends IDecoratorModelOptions<EntityOrder> {}

@Model<IModelOptionsOrderStats>({
  entity: EntityOrder,
  relations: {
    productStats: $relation.hasMany(() => ModelProduct, 'orderId', {
      autoload: true,
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
    productsGroups: $relation.hasMany(() => ModelProduct, 'orderId', {
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'amount',
      },
    }),
  },
})
export class ModelOrderStats extends BeanModelBase<EntityOrder> {}
