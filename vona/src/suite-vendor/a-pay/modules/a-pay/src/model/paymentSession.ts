import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPaymentSession } from '../entity/paymentSession.tsx';

export interface IModelOptionsPaymentSession extends IDecoratorModelOptions<EntityPaymentSession> {}

@Model<IModelOptionsPaymentSession>({ entity: EntityPaymentSession })
export class ModelPaymentSession extends BeanModelBase<EntityPaymentSession> {}
