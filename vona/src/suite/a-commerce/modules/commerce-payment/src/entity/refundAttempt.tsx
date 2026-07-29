import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export type TypeRefundAttemptState = 'created' | 'succeeded' | 'failed';

export interface IEntityOptionsRefundAttempt extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRefundAttempt>('commercePaymentRefundAttempt')
export class EntityRefundAttempt extends EntityBase {
  @Api.field(v.tableIdentity())
  refundRequestId: TableIdentity;

  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.enum(['created', 'succeeded', 'failed']))
  state: TypeRefundAttemptState;

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  amountCents: number;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.optional(), v.tableIdentity())
  refundOperationId?: TableIdentity;

  @Api.field(v.optional(), v.max(255))
  providerRefundId?: string;

  @Api.field(v.optional())
  finalizedAt?: Date;
}
