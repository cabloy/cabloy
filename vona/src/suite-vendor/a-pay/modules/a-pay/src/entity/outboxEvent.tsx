import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { IPaymentOutcomeEvent, TypeOutboxEventState } from '../types/payment.ts';

export interface IEntityOptionsOutboxEvent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOutboxEvent>('payOutboxEvent')
export class EntityOutboxEvent extends EntityBase {
  @Api.field(z.literal('payment.outcome.v1'))
  eventType: 'payment.outcome.v1';

  @Api.field(v.tableIdentity())
  paymentSessionId: TableIdentity;

  @Api.field(v.required())
  payload: IPaymentOutcomeEvent;

  @Api.field(z.enum(['pending', 'claimed', 'dispatched', 'failed']))
  state: TypeOutboxEventState;

  @Api.field(z.number().int().nonnegative())
  attemptCount: number;

  @Api.field(v.optional())
  claimedAt?: Date;

  @Api.field(v.optional(), v.max(100))
  claimToken?: string;

  @Api.field(v.optional())
  claimExpiresAt?: Date;

  @Api.field(v.optional())
  nextAttemptAt?: Date;

  @Api.field(v.optional())
  dispatchedAt?: Date;

  @Api.field(v.optional(), v.max(255))
  errorSummary?: string;
}
