import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityPaymentAudit } from '../entity/paymentAudit.tsx';

export interface IModelOptionsPaymentAudit extends IDecoratorModelOptions<EntityPaymentAudit> {}

@Model<IModelOptionsPaymentAudit>({ entity: EntityPaymentAudit })
export class ModelPaymentAudit extends BeanModelBase<EntityPaymentAudit> {}
