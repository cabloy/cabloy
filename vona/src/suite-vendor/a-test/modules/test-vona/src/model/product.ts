import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProduct } from '../entity/product.ts';

export interface IModelOptionsProduct extends IDecoratorModelOptions<EntityProduct> {}

@Model<IModelOptionsProduct>({ entity: EntityProduct })
export class ModelProduct extends BeanModelBase<EntityProduct> {}
