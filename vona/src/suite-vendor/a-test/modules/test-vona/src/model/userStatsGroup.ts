import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';
import { ModelPost } from './post.ts';

export interface IModelOptionsUserStatsGroup extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUserStatsGroup>({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(
      () => ModelPost,
      'userId',
      {
        autoload: true,
        groups: ['title'],
        aggrs: { count: ['*', 'title'], sum: 'stars' },
        orders: [['title', 'desc']],
      },
      undefined,
      true,
    ),
    roles: $relation.belongsToMany(
      'test-vona:roleUser',
      'test-vona:role',
      'userId',
      'roleId',
      { groups: ['name'], aggrs: { count: '*' }, orders: [['name', 'asc']] },
      undefined,
      true,
    ),
  },
})
export class ModelUserStatsGroup extends BeanModelBase<EntityUser> {}
