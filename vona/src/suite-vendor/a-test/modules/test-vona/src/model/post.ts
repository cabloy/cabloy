import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPost } from '../entity/post.ts';

export interface IModelOptionsPost extends IDecoratorModelOptions<EntityPost> {}

@Model<IModelOptionsPost>({
  entity: EntityPost,
  relations: {
    postContent: $relation.hasOne('test-vona:postContent', 'postId', {
      columns: ['id', 'content'],
    }),
    user: $relation.belongsTo('test-vona:post', 'test-vona:user', 'userId', {
      autoload: true,
      columns: ['id', 'name'],
    }),
  },
})
export class ModelPost extends BeanModelBase<EntityPost> {}
