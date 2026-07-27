import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypeRefundAttemptState } from './refundAttempt.tsx';
import type { TypeRefundRequestState } from './refundRequest.tsx';

export interface IEntityOptionsRefundAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRefundAudit>('commercePaymentRefundAudit')
export class EntityRefundAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  refundRequestId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  refundAttemptId?: TableIdentity;

  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.enum(['requested', 'approved', 'rejected', 'refunded', 'failed']))
  toRefundState: TypeRefundRequestState;

  @Api.field(v.optional(), z.enum(['created', 'succeeded', 'failed']))
  attemptState?: TypeRefundAttemptState;

  @Api.field(v.optional(), v.min(1), v.max(100))
  idempotencyKey?: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(v.required())
  processedAt: Date;
}
