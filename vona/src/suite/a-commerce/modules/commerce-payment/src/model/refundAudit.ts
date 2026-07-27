import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRefundAudit } from '../entity/refundAudit.tsx';

export interface IModelOptionsRefundAudit extends IDecoratorModelOptions<EntityRefundAudit> {}

@Model<IModelOptionsRefundAudit>({ entity: EntityRefundAudit })
export class ModelRefundAudit extends BeanModelBase<EntityRefundAudit> {}
