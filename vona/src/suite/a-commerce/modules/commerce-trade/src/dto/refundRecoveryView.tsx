import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRefundRecoveryView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundRecoveryView>()
export class DtoRefundRecoveryView {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  refundRequestId: TableIdentity;

  @Api.field(v.tableIdentity())
  refundAttemptId: TableIdentity;

  @Api.field(v.tableIdentity())
  refundOperationId: TableIdentity;

  @Api.field(v.tableIdentity())
  providerOperationId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(100))
  providerName: string;

  @Api.field(z.enum(['sandbox', 'live']))
  environment: 'sandbox' | 'live';

  @Api.field(z.enum(['created', 'submitting', 'pending', 'succeeded', 'failed', 'cancelled']))
  refundOperationState: 'created' | 'submitting' | 'pending' | 'succeeded' | 'failed' | 'cancelled';

  @Api.field(
    z.enum(['created', 'claimed', 'submitted', 'succeeded', 'failed', 'reconciliation_required']),
  )
  providerOperationState:
    | 'created'
    | 'claimed'
    | 'submitted'
    | 'succeeded'
    | 'failed'
    | 'reconciliation_required';

  @Api.field(z.number().int().nonnegative())
  attemptCount: number;

  @Api.field(v.optional(), v.max(255))
  providerRefundId?: string;

  @Api.field(v.optional(), v.max(100))
  errorCode?: string;

  @Api.field(v.optional(), v.max(255))
  errorSummary?: string;

  @Api.field(v.optional())
  submittedAt?: Date;

  @Api.field(v.optional())
  finalizedAt?: Date;

  @Api.field(z.enum(['none', 'await_webhook', 'reconcile_only', 'query_only', 'retry_same_key']))
  recoveryDisposition:
    | 'none'
    | 'await_webhook'
    | 'reconcile_only'
    | 'query_only'
    | 'retry_same_key';

  @Api.field(v.required())
  recoveryMessage: string;
}
