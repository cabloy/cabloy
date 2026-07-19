import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProduct } from '../entity/product.tsx';

export interface IModelOptionsProduct extends IDecoratorModelOptions<EntityProduct> {}

@Model<IModelOptionsProduct>({
  entity: EntityProduct,
  relations: {
    category: $relation.belongsTo(
      'commerce-catalog:product',
      'commerce-catalog:category',
      'categoryId',
    ),
  },
})
export class ModelProduct extends BeanModelBase<EntityProduct> {}
