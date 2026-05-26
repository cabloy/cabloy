import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRole } from '../entity/role.ts';
import { ModelRoleUser } from './roleUser.ts';
import { ModelUser } from './user.ts';

export interface IModelOptionsRole extends IDecoratorModelOptions<EntityRole> {}

@Model<IModelOptionsRole>({
  entity: EntityRole,
  relations: {
    users: $relation.belongsToMany(
      () => ModelRoleUser,
      () => ModelUser,
      'roleId',
      'userId',
      { columns: ['id', 'name'] },
    ),
  },
})
export class ModelRole extends BeanModelBase<EntityRole> {}
