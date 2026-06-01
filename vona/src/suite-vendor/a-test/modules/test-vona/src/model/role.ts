import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRole } from '../entity/role.ts';

export interface IModelOptionsRole extends IDecoratorModelOptions<EntityRole> {}

@Model<IModelOptionsRole>({
  entity: EntityRole,
  relations: {
    users: $relation.belongsToMany('test-vona:roleUser', 'test-vona:user', 'roleId', 'userId', {
      columns: ['id', 'name'],
    }),
  },
})
export class ModelRole extends BeanModelBase<EntityRole> {}
