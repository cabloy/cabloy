import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySku } from '../entity/sku.tsx';

export interface IModelOptionsSku extends IDecoratorModelOptions<EntitySku> {}

@Model<IModelOptionsSku>({
  entity: EntitySku,
  cache: {
    modelsClear: 'commerce-catalog:product',
  },
  relations: {
    product: $relation.belongsTo('commerce-catalog:sku', 'commerce-catalog:product', 'productId'),
  },
})
export class ModelSku extends BeanModelBase<EntitySku> {}
