import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPostContent } from '../entity/postContent.ts';
import { ModelPost } from './post.ts';

export interface IModelOptionsPostContent extends IDecoratorModelOptions<EntityPostContent> {}

@Model<IModelOptionsPostContent>({
  entity: EntityPostContent,
  relations: {
    post: $relation.belongsTo(
      () => ModelPostContent,
      () => ModelPost,
      'postId',
    ),
  },
  cache: {
    modelsClear: () => ModelPost,
  },
})
export class ModelPostContent extends BeanModelBase<EntityPostContent> {}
