import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCategory } from '../entity/category.ts';

export interface IModelOptionsCategory extends IDecoratorModelOptions<EntityCategory> {}

@Model<IModelOptionsCategory>({
  entity: EntityCategory,
  relations: {
    children: $relation.hasMany('test-vona:category', 'categoryIdParent', {
      autoload: true,
      columns: ['id', 'name'],
    }),
  },
  cache: {
    modelsClear: 'test-vona:categoryChain',
  },
})
export class ModelCategory extends BeanModelBase<EntityCategory> {}
