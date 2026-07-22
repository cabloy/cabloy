import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityCouponTemplate } from '../entity/couponTemplate.tsx';

export interface IModelOptionsCouponTemplate extends IDecoratorModelOptions<EntityCouponTemplate> {}

@Model<IModelOptionsCouponTemplate>({ entity: EntityCouponTemplate })
export class ModelCouponTemplate extends BeanModelBase<EntityCouponTemplate> {}
