import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCouponAudit } from '../entity/couponAudit.tsx';

export interface IModelOptionsCouponAudit extends IDecoratorModelOptions<EntityCouponAudit> {}

@Model<IModelOptionsCouponAudit>({ entity: EntityCouponAudit })
export class ModelCouponAudit extends BeanModelBase<EntityCouponAudit> {}
