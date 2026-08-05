import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCategory } from '../entity/category.tsx';

export interface IModelOptionsCategory extends IDecoratorModelOptions<EntityCategory> {}

@Model<IModelOptionsCategory>({
  entity: EntityCategory,
  relations: {
    parent: $relation.belongsTo(
      'commerce-catalog:category',
      'commerce-catalog:category',
      'parentId',
      {
        columns: ['id', 'name'],
      },
    ),
  },
  cache: {
    modelsClear: 'commerce-catalog:product',
  },
})
export class ModelCategory extends BeanModelBase<EntityCategory> {}
