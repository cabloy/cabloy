import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityAuthSimple } from '../entity/authSimple.ts';

export interface IModelOptionsAuthSimple extends IDecoratorModelOptions<EntityAuthSimple> {}

@Model<IModelOptionsAuthSimple>({ entity: EntityAuthSimple, disableDeleted: true })
export class ModelAuthSimple extends BeanModelBase<EntityAuthSimple> {}
