import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commercePaymentAttempt', ['orderId', 'userId', 'state', 'correlationId']),
    ...$tableColumns('commercePaymentAudit', [
      'paymentAttemptId',
      'providerEventId',
      'orderId',
      'idempotencyKey',
    ]),
    ...$tableColumns('commercePaymentRefundRequest', [
      'orderId',
      'userId',
      'state',
      'correlationId',
    ]),
    ...$tableColumns('commercePaymentRefundAttempt', ['refundRequestId', 'orderId', 'state']),
    ...$tableColumns('commercePaymentRefundAudit', [
      'refundRequestId',
      'refundAttemptId',
      'orderId',
      'idempotencyKey',
      'correlationId',
    ]),
  },
})
export class MetaIndex extends BeanBase {}
