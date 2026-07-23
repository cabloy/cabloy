import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export type TypePaymentAttemptState = 'created' | 'cancelled';

export interface IEntityOptionsPaymentAttempt extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPaymentAttempt>('commercePaymentAttempt')
export class EntityPaymentAttempt extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.enum(['created', 'cancelled']))
  state: TypePaymentAttemptState;

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  amountCents: number;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.optional())
  cancelledAt?: Date;
}
