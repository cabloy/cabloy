import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';

export interface IModelOptionsUser extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUser>({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany('test-vona:post', 'userId', { columns: ['id', 'title'] }, [
      'test-vona:user',
      'test-vona:postContent',
    ]),
    roles: $relation.belongsToMany('test-vona:roleUser', 'test-vona:role', 'userId', 'roleId', {
      columns: ['id', 'name'],
    }),
    orders: $relation.hasMany('test-vona:order', 'userId'),
  },
  cache: {
    modelsClear: ['test-vona:userStats', 'test-vona:userStatsGroup'],
  },
})
export class ModelUser extends BeanModelBase<EntityUser> {}
