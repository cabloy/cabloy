import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCustomScope } from '../entity/customScope.tsx';

export interface IModelOptionsCustomScope extends IDecoratorModelOptions<EntityCustomScope> {}

@Model<IModelOptionsCustomScope>({ entity: EntityCustomScope })
export class ModelCustomScope extends BeanModelBase<EntityCustomScope> {}
