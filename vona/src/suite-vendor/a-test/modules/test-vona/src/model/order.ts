import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrder } from '../entity/order.ts';

export interface IModelOptionsOrder extends IDecoratorModelOptions<EntityOrder> {}

@Model<IModelOptionsOrder>({
  entity: EntityOrder,
  relations: {
    user: $relation.belongsTo('test-vona:order', 'test-vona:user', 'userId', {
      autoload: true,
      columns: ['id', 'name'],
    }),
    products: $relation.hasMany('test-vona:product', 'orderId', {
      autoload: true,
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
  cache: {
    modelsClear: 'test-vona:orderStats',
  },
})
export class ModelOrder extends BeanModelBase<EntityOrder> {}
