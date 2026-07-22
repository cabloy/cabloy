import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCouponGrant } from '../entity/couponGrant.tsx';

export interface IModelOptionsCouponGrant extends IDecoratorModelOptions<EntityCouponGrant> {}

@Model<IModelOptionsCouponGrant>({ entity: EntityCouponGrant })
export class ModelCouponGrant extends BeanModelBase<EntityCouponGrant> {}
