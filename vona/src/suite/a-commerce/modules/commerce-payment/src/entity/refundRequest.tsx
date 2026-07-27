import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export type TypeRefundRequestState = 'requested' | 'approved' | 'rejected' | 'refunded' | 'failed';

export interface IEntityOptionsRefundRequest extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRefundRequest>('commercePaymentRefundRequest')
export class EntityRefundRequest extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.enum(['requested', 'approved', 'rejected', 'refunded', 'failed']))
  state: TypeRefundRequestState;

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  amountCents: number;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.optional(), v.tableIdentity())
  reviewedBy?: TableIdentity;

  @Api.field(v.optional())
  reviewedAt?: Date;

  @Api.field(v.optional())
  finalizedAt?: Date;
}
