import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRole } from '../entity/role.ts';

export interface IModelOptionsRole extends IDecoratorModelOptions<EntityRole> {}

@Model<IModelOptionsRole>({ entity: EntityRole })
export class ModelRole extends BeanModelBase<EntityRole> {}
