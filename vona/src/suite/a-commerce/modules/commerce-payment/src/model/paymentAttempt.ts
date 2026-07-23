import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';

export interface IModelOptionsPaymentAttempt extends IDecoratorModelOptions<EntityPaymentAttempt> {}

@Model<IModelOptionsPaymentAttempt>({ entity: EntityPaymentAttempt })
export class ModelPaymentAttempt extends BeanModelBase<EntityPaymentAttempt> {}
