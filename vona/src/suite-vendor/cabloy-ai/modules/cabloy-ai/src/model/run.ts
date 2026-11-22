import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRun } from '../entity/run.tsx';

export interface IModelOptionsRun extends IDecoratorModelOptions<EntityRun> {}

@Model<IModelOptionsRun>({ entity: EntityRun })
export class ModelRun extends BeanModelBase<EntityRun> {}
