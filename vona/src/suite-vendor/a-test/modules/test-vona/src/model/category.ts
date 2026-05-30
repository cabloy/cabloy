import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';
import { ModelCategoryChain } from 'vona-module-test-vona';

import { EntityCategory } from '../entity/category.ts';

export interface IModelOptionsCategory extends IDecoratorModelOptions<EntityCategory> {}

@Model<IModelOptionsCategory>({
  entity: EntityCategory,
  relations: {
    children: $relation.hasMany(() => ModelCategory, 'categoryIdParent', {
      autoload: true,
      columns: ['id', 'name'],
    }),
  },
  cache: {
    modelsClear: () => ModelCategoryChain,
  },
})
export class ModelCategory extends BeanModelBase<EntityCategory> {}
