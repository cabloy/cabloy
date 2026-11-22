import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityConversation } from '../entity/conversation.tsx';

export interface IModelOptionsConversation extends IDecoratorModelOptions<EntityConversation> {}

@Model<IModelOptionsConversation>({ entity: EntityConversation })
export class ModelConversation extends BeanModelBase<EntityConversation> {}
