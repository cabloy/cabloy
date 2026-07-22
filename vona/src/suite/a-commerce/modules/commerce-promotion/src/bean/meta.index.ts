import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commercePromotionCouponTemplate', 'state'),
    ...$tableColumns('commercePromotionCouponTemplate', 'validUntil'),
    ...$tableColumns('commercePromotionCouponGrant', 'templateId'),
    ...$tableColumns('commercePromotionCouponGrant', 'userId'),
    ...$tableColumns('commercePromotionCouponGrant', 'state'),
    ...$tableColumns('commercePromotionCouponGrant', 'validUntilSnapshot'),
    ...$tableColumns('commercePromotionCouponGrant', 'reservationOrderId'),
    ...$tableColumns('commercePromotionCouponGrant', 'reservationCorrelationId'),
    ...$tableColumns('commercePromotionCouponGrant', 'redeemedOrderId'),
    ...$tableColumns('commercePromotionCouponAudit', 'couponGrantId'),
    ...$tableColumns('commercePromotionCouponAudit', 'templateId'),
    ...$tableColumns('commercePromotionCouponAudit', 'orderId'),
    ...$tableColumns('commercePromotionCouponAudit', 'correlationId'),
  },
})
export class MetaIndex extends BeanBase {}
