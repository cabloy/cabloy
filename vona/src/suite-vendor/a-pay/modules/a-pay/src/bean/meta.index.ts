import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('payPaymentSession', 'businessReference'),
    ...$tableColumns('payPaymentSession', 'state+expiresAt'),
    ...$tableColumns('payPaymentSession', 'providerPaymentId'),
    ...$tableColumns('payPaymentSession', 'providerOrderId'),
    ...$tableColumns('payPaymentSession', 'providerCaptureId'),
    ...$tableColumns('payProviderOperation', 'paymentSessionId+kind'),
    ...$tableColumns('payProviderOperation', 'refundOperationId'),
    ...$tableColumns('payProviderOperation', 'state+nextAttemptAt'),
    ...$tableColumns('payProviderOperation', 'state+claimExpiresAt'),
    ...$tableColumns('payProviderOperation', 'idempotencyKey'),
    ...$tableColumns(
      'payProviderOperationRecoveryAudit',
      'providerOperationId+actionIdempotencyKey',
    ),
    ...$tableColumns('payProviderOperationRecoveryAudit', 'providerOperationId+occurredAt'),
    ...$tableColumns('payRefundOperation', 'paymentSessionId'),
    ...$tableColumns('payRefundOperation', 'providerRefundId'),
    ...$tableColumns('payRefundOperation', 'state'),
    ...$tableColumns('payWebhookInbox', 'providerName+clientName'),
    ...$tableColumns('payWebhookInbox', 'providerEventId'),
    ...$tableColumns('payWebhookInbox', 'paymentSessionId'),
    ...$tableColumns('payWebhookInbox', 'state'),
    ...$tableColumns('payPaymentAudit', 'paymentSessionId'),
    ...$tableColumns('payOutboxEvent', 'refundOperationId'),
    ...$tableColumns('payOutboxEvent', 'state+nextAttemptAt'),
    ...$tableColumns('payOutboxEvent', 'state+claimExpiresAt'),
  },
})
export class MetaIndex extends BeanBase {}
