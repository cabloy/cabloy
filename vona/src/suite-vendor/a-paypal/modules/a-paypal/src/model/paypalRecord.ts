import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPaypalRecord } from '../entity/paypalRecord.tsx';

export interface IModelOptionsPaypalRecord extends IDecoratorModelOptions<EntityPaypalRecord> {}

@Model<IModelOptionsPaypalRecord>({ entity: EntityPaypalRecord })
export class ModelPaypalRecord extends BeanModelBase<EntityPaypalRecord> {}
