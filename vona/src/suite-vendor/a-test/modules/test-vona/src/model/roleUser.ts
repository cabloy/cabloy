import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRoleUser } from '../entity/roleUser.ts';

export interface IModelOptionsRoleUser extends IDecoratorModelOptions<EntityRoleUser> {}

@Model<IModelOptionsRoleUser>({ entity: EntityRoleUser })
export class ModelRoleUser extends BeanModelBase<EntityRoleUser> {}
