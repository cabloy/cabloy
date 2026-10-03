import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commercePromotionCouponTemplate', ['state', 'validUntil']),
    ...$tableColumns('commercePromotionCouponGrant', [
      'templateId',
      'userId',
      'state',
      'validUntilSnapshot',
      'reservationOrderId',
      'reservationCorrelationId',
      'redeemedOrderId',
    ]),
    ...$tableColumns('commercePromotionCouponAudit', [
      'couponGrantId',
      'templateId',
      'orderId',
      'correlationId',
    ]),
  },
})
export class MetaIndex extends BeanBase {}
