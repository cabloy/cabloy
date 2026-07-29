import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityWebhookInbox } from '../entity/webhookInbox.tsx';

export interface IModelOptionsWebhookInbox extends IDecoratorModelOptions<EntityWebhookInbox> {}

@Model<IModelOptionsWebhookInbox>({ entity: EntityWebhookInbox })
export class ModelWebhookInbox extends BeanModelBase<EntityWebhookInbox> {}
