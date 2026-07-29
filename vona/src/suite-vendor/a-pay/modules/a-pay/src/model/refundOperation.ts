import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRefundOperation } from '../entity/refundOperation.tsx';

export interface IModelOptionsRefundOperation extends IDecoratorModelOptions<EntityRefundOperation> {}

@Model<IModelOptionsRefundOperation>({ entity: EntityRefundOperation })
export class ModelRefundOperation extends BeanModelBase<EntityRefundOperation> {}
