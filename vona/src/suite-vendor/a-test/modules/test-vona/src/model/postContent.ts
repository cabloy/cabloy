import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPostContent } from '../entity/postContent.ts';

export interface IModelOptionsPostContent extends IDecoratorModelOptions<EntityPostContent> {}

@Model<IModelOptionsPostContent>({
  entity: EntityPostContent,
  relations: {
    post: $relation.belongsTo('test-vona:postContent', 'test-vona:post', 'postId'),
  },
  cache: {
    modelsClear: 'test-vona:post',
  },
})
export class ModelPostContent extends BeanModelBase<EntityPostContent> {}
