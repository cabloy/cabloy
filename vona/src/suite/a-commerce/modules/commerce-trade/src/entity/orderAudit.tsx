import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypeOrderState } from './order.tsx';

export type TypeOrderAuditOperation =
  | 'created'
  | 'paid'
  | 'cancelled'
  | 'expired'
  | 'shipped'
  | 'refund_requested'
  | 'refund_approved'
  | 'refund_rejected'
  | 'refund_failed'
  | 'refunded';

export interface IEntityOptionsOrderAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOrderAudit>('commerceTradeOrderAudit')
export class EntityOrderAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(
    z.enum([
      'created',
      'paid',
      'cancelled',
      'expired',
      'shipped',
      'refund_requested',
      'refund_approved',
      'refund_rejected',
      'refund_failed',
      'refunded',
    ]),
  )
  operation: TypeOrderAuditOperation;

  @Api.field(
    v.optional(),
    z.enum([
      'awaiting_payment',
      'paid',
      'refund_requested',
      'refund_approved',
      'refund_rejected',
      'shipped',
      'refunded',
      'cancelled',
      'expired',
    ]),
  )
  fromState?: TypeOrderState;

  @Api.field(
    z.enum([
      'awaiting_payment',
      'paid',
      'refund_requested',
      'refund_approved',
      'refund_rejected',
      'shipped',
      'refunded',
      'cancelled',
      'expired',
    ]),
  )
  toState: TypeOrderState;

  @Api.field(v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;
}
