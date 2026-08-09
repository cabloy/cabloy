import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypeProviderOperationState } from '../types/payment.ts';

export interface IEntityOptionsProviderOperationRecoveryAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsProviderOperationRecoveryAudit>('payProviderOperationRecoveryAudit')
export class EntityProviderOperationRecoveryAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  providerOperationId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(z.enum(['reconcile', 'retry']))
  action: 'reconcile' | 'retry';

  @Api.field(v.required(), v.min(1), v.max(100))
  actionIdempotencyKey: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(
    z.enum(['created', 'claimed', 'submitted', 'succeeded', 'failed', 'reconciliation_required']),
  )
  beforeState: TypeProviderOperationState;

  @Api.field(
    z.enum(['created', 'claimed', 'submitted', 'succeeded', 'failed', 'reconciliation_required']),
  )
  afterState: TypeProviderOperationState;

  @Api.field(z.number().int().nonnegative())
  beforeAttemptCount: number;

  @Api.field(z.number().int().nonnegative())
  afterAttemptCount: number;

  @Api.field(z.enum(['reconciled', 'unresolved', 'retried']))
  resolution: 'reconciled' | 'unresolved' | 'retried';

  @Api.field(v.optional(), v.max(255))
  providerRefundId?: string;

  @Api.field(v.required())
  occurredAt: Date;
}
