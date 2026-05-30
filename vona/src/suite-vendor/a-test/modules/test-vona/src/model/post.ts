import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPost } from '../entity/post.ts';
import { ModelPostContent } from './postContent.ts';
import { ModelUser } from './user.ts';

export interface IModelOptionsPost extends IDecoratorModelOptions<EntityPost> {}

@Model<IModelOptionsPost>({
  entity: EntityPost,
  relations: {
    postContent: $relation.hasOne(ModelPostContent, 'postId', { columns: ['id', 'content'] }),
    user: $relation.belongsTo(
      () => ModelPost,
      () => ModelUser,
      'userId',
      { autoload: true, columns: ['id', 'name'] },
    ),
  },
})
export class ModelPost extends BeanModelBase<EntityPost> {}
