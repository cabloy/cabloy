import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrder } from '../entity/order.ts';
import { ModelOrderStats } from './orderStats.ts';
import { ModelProduct } from './product.ts';
import { ModelUser } from './user.ts';

export interface IModelOptionsOrder extends IDecoratorModelOptions<EntityOrder> {}

@Model<IModelOptionsOrder>({
  entity: EntityOrder,
  relations: {
    user: $relation.belongsTo(
      () => ModelOrder,
      () => ModelUser,
      'userId',
      {
        autoload: true,
        columns: ['id', 'name'],
      },
    ),
    products: $relation.hasMany(() => ModelProduct, 'orderId', {
      autoload: true,
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
  cache: {
    modelsClear: () => ModelOrderStats,
  },
})
export class ModelOrder extends BeanModelBase<EntityOrder> {}
