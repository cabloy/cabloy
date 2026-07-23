import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commercePaymentAttempt', 'orderId'),
    ...$tableColumns('commercePaymentAttempt', 'userId'),
    ...$tableColumns('commercePaymentAttempt', 'state'),
    ...$tableColumns('commercePaymentAttempt', 'correlationId'),
    ...$tableColumns('commercePaymentAudit', 'paymentAttemptId'),
    ...$tableColumns('commercePaymentAudit', 'orderId'),
    ...$tableColumns('commercePaymentAudit', 'idempotencyKey'),
  },
})
export class MetaIndex extends BeanBase {}
