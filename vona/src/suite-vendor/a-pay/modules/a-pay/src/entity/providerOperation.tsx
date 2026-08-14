import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type {
  IPayProviderOperationStartInputSnapshot,
  TypeProviderOperationKind,
  TypeProviderOperationState,
} from '../types/payment.ts';

export interface IEntityOptionsProviderOperation extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsProviderOperation>('payProviderOperation')
export class EntityProviderOperation extends EntityBase {
  @Api.field(v.tableIdentity())
  paymentSessionId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  refundOperationId?: TableIdentity;

  @Api.field(z.enum(['start', 'confirm', 'query', 'refund']))
  kind: TypeProviderOperationKind;

  @Api.field(
    z.enum(['created', 'claimed', 'submitted', 'succeeded', 'failed', 'reconciliation_required']),
  )
  state: TypeProviderOperationState;

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.optional())
  startInputSnapshot?: IPayProviderOperationStartInputSnapshot;

  @Api.field(v.optional(), v.max(255))
  providerRequestId?: string;

  @Api.field(v.optional(), v.max(255))
  providerResourceId?: string;

  @Api.field(z.number().int().nonnegative())
  attemptCount: number;

  @Api.field(v.optional())
  claimedAt?: Date;

  @Api.field(v.optional(), v.max(100))
  claimToken?: string;

  @Api.field(v.optional())
  claimExpiresAt?: Date;

  @Api.field(v.optional())
  submittedAt?: Date;

  @Api.field(v.optional())
  recoveryRetryGrantedAt?: Date;

  @Api.field(v.optional())
  nextAttemptAt?: Date;

  @Api.field(v.optional(), v.max(100))
  errorCode?: string;

  @Api.field(v.optional(), v.max(255))
  errorSummary?: string;

  @Api.field(v.optional())
  finalizedAt?: Date;
}
