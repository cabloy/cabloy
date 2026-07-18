import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntitySku } from '../entity/sku.tsx';

export interface IModelOptionsSku extends IDecoratorModelOptions<EntitySku> {}

@Model<IModelOptionsSku>({ entity: EntitySku })
export class ModelSku extends BeanModelBase<EntitySku> {}
