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
    ...$tableColumns('payProviderOperation', 'state+nextAttemptAt'),
    ...$tableColumns('payProviderOperation', 'idempotencyKey'),
    ...$tableColumns('payRefundOperation', 'paymentSessionId'),
    ...$tableColumns('payRefundOperation', 'state'),
    ...$tableColumns('payWebhookInbox', 'providerName+clientName'),
    ...$tableColumns('payWebhookInbox', 'providerEventId'),
    ...$tableColumns('payWebhookInbox', 'state'),
    ...$tableColumns('payPaymentAudit', 'paymentSessionId'),
    ...$tableColumns('payOutboxEvent', 'state+nextAttemptAt'),
  },
})
export class MetaIndex extends BeanBase {}
