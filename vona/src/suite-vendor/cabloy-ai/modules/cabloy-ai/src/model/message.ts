import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityMessage } from '../entity/message.tsx';

export interface IModelOptionsMessage extends IDecoratorModelOptions<EntityMessage> {}

@Model<IModelOptionsMessage>({ entity: EntityMessage })
export class ModelMessage extends BeanModelBase<EntityMessage> {}
