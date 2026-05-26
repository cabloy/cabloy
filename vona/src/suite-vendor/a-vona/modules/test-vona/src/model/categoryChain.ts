import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCategory } from '../entity/category.ts';

export interface IModelOptionsCategoryChain extends IDecoratorModelOptions<EntityCategory> {}

@Model<IModelOptionsCategoryChain>({
  entity: EntityCategory,
  relations: {
    parent: $relation.belongsTo(
      () => ModelCategoryChain,
      () => ModelCategoryChain,
      'categoryIdParent',
      {
        autoload: true,
        columns: ['id', 'name', 'categoryIdParent'],
      },
    ),
  },
})
export class ModelCategoryChain extends BeanModelBase<EntityCategory> {}
