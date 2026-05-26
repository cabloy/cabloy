import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStatus } from '../entity/status.ts';

export interface IModelOptionsStatus extends IDecoratorModelOptions<EntityStatus> {}

@Model<IModelOptionsStatus>({ entity: EntityStatus, disableDeleted: true })
export class ModelStatus extends BeanModelBase<EntityStatus> {}
