import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityViewRecord } from '../entity/viewRecord.ts';

export interface IModelOptionsViewRecord extends IDecoratorModelOptions<EntityViewRecord> {}

@Model<IModelOptionsViewRecord>({
  entity: EntityViewRecord,
  disableDeleted: false,
  disableInstance: true,
})
export class ModelViewRecord extends BeanModelBase<EntityViewRecord> {}
