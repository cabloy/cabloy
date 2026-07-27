import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRefundRequest } from '../entity/refundRequest.tsx';

export interface IModelOptionsRefundRequest extends IDecoratorModelOptions<EntityRefundRequest> {}

@Model<IModelOptionsRefundRequest>({ entity: EntityRefundRequest })
export class ModelRefundRequest extends BeanModelBase<EntityRefundRequest> {}
