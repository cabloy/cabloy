import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('payPaymentSession', [
      'businessReference',
      'providerCorrelationReference',
      'state+expiresAt',
      'providerPaymentId',
      'providerOrderId',
      'providerCaptureId',
    ]),
    ...$tableColumns('payProviderOperation', [
      'paymentSessionId+kind',
      'refundOperationId',
      'nextAttemptAt+state',
      'claimExpiresAt+state',
      'idempotencyKey',
    ]),
    ...$tableColumns('payProviderOperationRecoveryAudit', [
      'providerOperationId+actionIdempotencyKey',
      'occurredAt+providerOperationId',
    ]),
    ...$tableColumns('payRefundOperation', [
      'paymentSessionId',
      'providerCorrelationReference',
      'providerRefundId',
      'state',
    ]),
    ...$tableColumns('payWebhookInbox', [
      'providerName+clientName',
      'providerEventId',
      'paymentSessionId',
      'state',
    ]),
    ...$tableColumns('payPaymentAudit', 'paymentSessionId'),
    ...$tableColumns('payOutboxEvent', [
      'refundOperationId',
      'nextAttemptAt+state',
      'claimExpiresAt+state',
    ]),
  },
})
export class MetaIndex extends BeanBase {}
