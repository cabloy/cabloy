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
    ...$tableColumns('commercePaymentAudit', 'providerEventId'),
    ...$tableColumns('commercePaymentAudit', 'orderId'),
    ...$tableColumns('commercePaymentAudit', 'idempotencyKey'),
    ...$tableColumns('commercePaymentRefundRequest', 'orderId'),
    ...$tableColumns('commercePaymentRefundRequest', 'userId'),
    ...$tableColumns('commercePaymentRefundRequest', 'state'),
    ...$tableColumns('commercePaymentRefundRequest', 'correlationId'),
    ...$tableColumns('commercePaymentRefundAttempt', 'refundRequestId'),
    ...$tableColumns('commercePaymentRefundAttempt', 'orderId'),
    ...$tableColumns('commercePaymentRefundAttempt', 'state'),
    ...$tableColumns('commercePaymentRefundAudit', 'refundRequestId'),
    ...$tableColumns('commercePaymentRefundAudit', 'refundAttemptId'),
    ...$tableColumns('commercePaymentRefundAudit', 'orderId'),
    ...$tableColumns('commercePaymentRefundAudit', 'idempotencyKey'),
    ...$tableColumns('commercePaymentRefundAudit', 'correlationId'),
  },
})
export class MetaIndex extends BeanBase {}
