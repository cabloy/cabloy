import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';

export interface IModelOptionsUserStats extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUserStats>({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany('test-vona:post', 'userId', {
      autoload: true,
      aggrs: { count: ['*', 'title'], sum: 'stars' },
    }),
    roles: $relation.belongsToMany('test-vona:roleUser', 'test-vona:role', 'userId', 'roleId', {
      aggrs: { count: '*' },
    }),
  },
})
export class ModelUserStats extends BeanModelBase<EntityUser> {}
