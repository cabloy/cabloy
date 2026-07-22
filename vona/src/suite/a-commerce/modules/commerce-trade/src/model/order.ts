import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOrder } from '../entity/order.tsx';

export interface IModelOptionsOrder extends IDecoratorModelOptions<EntityOrder> {}

@Model<IModelOptionsOrder>({
  entity: EntityOrder,
  relations: {
    lines: $relation.hasMany('commerce-trade:orderLine', 'orderId'),
  },
})
export class ModelOrder extends BeanModelBase<EntityOrder> {}
