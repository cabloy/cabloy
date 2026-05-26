import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityVersion } from '../entity/version.ts';

export interface IModelOptionsVersion extends IDecoratorModelOptions<EntityVersion> {}

@Model<IModelOptionsVersion>({
  entity: EntityVersion,
  disableInstance: true,
  disableDeleted: true,
})
export class ModelVersion extends BeanModelBase<EntityVersion> {}
