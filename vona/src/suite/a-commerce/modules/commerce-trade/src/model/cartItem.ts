import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCartItem } from '../entity/cartItem.tsx';

export interface IModelOptionsCartItem extends IDecoratorModelOptions<EntityCartItem> {}

@Model<IModelOptionsCartItem>({ entity: EntityCartItem })
export class ModelCartItem extends BeanModelBase<EntityCartItem> {}
