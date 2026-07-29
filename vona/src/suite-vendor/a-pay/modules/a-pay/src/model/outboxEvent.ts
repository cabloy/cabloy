import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityOutboxEvent } from '../entity/outboxEvent.tsx';

export interface IModelOptionsOutboxEvent extends IDecoratorModelOptions<EntityOutboxEvent> {}

@Model<IModelOptionsOutboxEvent>({ entity: EntityOutboxEvent })
export class ModelOutboxEvent extends BeanModelBase<EntityOutboxEvent> {}
