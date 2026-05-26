import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityVersionInit } from '../entity/versionInit.ts';

export interface IModelOptionsVersionInit extends IDecoratorModelOptions<EntityVersionInit> {}

@Model<IModelOptionsVersionInit>({
  entity: EntityVersionInit,
  disableInstance: true,
  disableDeleted: true,
})
export class ModelVersionInit extends BeanModelBase<EntityVersionInit> {}
