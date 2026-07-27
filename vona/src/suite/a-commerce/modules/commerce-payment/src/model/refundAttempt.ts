import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRefundAttempt } from '../entity/refundAttempt.tsx';

export interface IModelOptionsRefundAttempt extends IDecoratorModelOptions<EntityRefundAttempt> {}

@Model<IModelOptionsRefundAttempt>({ entity: EntityRefundAttempt })
export class ModelRefundAttempt extends BeanModelBase<EntityRefundAttempt> {}
