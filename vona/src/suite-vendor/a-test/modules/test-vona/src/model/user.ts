import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityUser } from '../entity/user.ts';
import { ModelOrder } from './order.ts';
import { ModelPost } from './post.ts';
import { ModelPostContent } from './postContent.ts';
import { ModelUserStats } from './userStats.ts';
import { ModelUserStatsGroup } from './userStatsGroup.ts';

export interface IModelOptionsUser extends IDecoratorModelOptions<EntityUser> {}

@Model<IModelOptionsUser>({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(() => ModelPost, 'userId', { columns: ['id', 'title'] }, [
      'test-vona:user',
      ModelPostContent,
    ]),
    roles: $relation.belongsToMany('test-vona:roleUser', 'test-vona:role', 'userId', 'roleId', {
      columns: ['id', 'name'],
    }),
    orders: $relation.hasMany(() => ModelOrder, 'userId'),
  },
  cache: {
    modelsClear: [() => ModelUserStats, () => ModelUserStatsGroup],
  },
})
export class ModelUser extends BeanModelBase<EntityUser> {}
