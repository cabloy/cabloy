import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUsage } from '../entity/usage.tsx';

export interface IModelOptionsUsage extends IDecoratorModelOptions<EntityUsage> {}

@Model<IModelOptionsUsage>({ entity: EntityUsage })
export class ModelUsage extends BeanModelBase<EntityUsage> {}
