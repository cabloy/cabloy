import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCategory } from '../entity/category.tsx';

export interface IModelOptionsCategory extends IDecoratorModelOptions<EntityCategory> {}

@Model<IModelOptionsCategory>({
  entity: EntityCategory,
  cache: {
    modelsClear: 'commerce-catalog:product',
  },
})
export class ModelCategory extends BeanModelBase<EntityCategory> {}
