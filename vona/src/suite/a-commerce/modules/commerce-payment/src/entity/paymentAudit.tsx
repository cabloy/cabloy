import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypePaymentAttemptState } from './paymentAttempt.tsx';

export type TypePaymentOutcome = Extract<
  TypePaymentAttemptState,
  'succeeded' | 'failed' | 'cancelled'
>;

export interface IEntityOptionsPaymentAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPaymentAudit>('commercePaymentAudit')
export class EntityPaymentAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  paymentAttemptId: TableIdentity;

  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.literal('mock'))
  provider: 'mock';

  @Api.field(z.enum(['succeeded', 'failed', 'cancelled']))
  outcome: TypePaymentOutcome;

  @Api.field(z.enum(['created', 'succeeded', 'failed', 'cancelled']))
  fromAttemptState: TypePaymentAttemptState;

  @Api.field(z.enum(['paid', 'cancelled', 'expired']))
  toOrderState: 'paid' | 'cancelled' | 'expired';

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(v.required())
  processedAt: Date;
}
