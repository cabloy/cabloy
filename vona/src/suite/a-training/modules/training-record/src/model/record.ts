import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRecord } from '../entity/record.tsx';

export interface IModelOptionsRecord extends IDecoratorModelOptions<EntityRecord> {}

@Model<IModelOptionsRecord>({ entity: EntityRecord })
export class ModelRecord extends BeanModelBase<EntityRecord> {}
