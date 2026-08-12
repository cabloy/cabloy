import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProductContent } from '../entity/productContent.tsx';

export interface IModelOptionsProductContent extends IDecoratorModelOptions<EntityProductContent> {}

@Model<IModelOptionsProductContent>({
  entity: EntityProductContent,
  relations: {
    product: $relation.belongsTo(
      'commerce-catalog:productContent',
      'commerce-catalog:product',
      'productId',
    ),
  },
  cache: {
    modelsClear: 'commerce-catalog:product',
  },
})
export class ModelProductContent extends BeanModelBase<EntityProductContent> {}
