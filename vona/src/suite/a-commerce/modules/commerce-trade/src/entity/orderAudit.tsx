import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypeOrderState } from './order.tsx';

export type TypeOrderAuditOperation = 'created' | 'paid' | 'cancelled' | 'expired';

export interface IEntityOptionsOrderAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOrderAudit>('commerceTradeOrderAudit')
export class EntityOrderAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(z.enum(['created', 'paid', 'cancelled', 'expired']))
  operation: TypeOrderAuditOperation;

  @Api.field(v.optional(), z.enum(['awaiting_payment', 'paid', 'cancelled', 'expired']))
  fromState?: Extract<TypeOrderState, 'awaiting_payment' | 'paid' | 'cancelled' | 'expired'>;

  @Api.field(z.enum(['awaiting_payment', 'paid', 'cancelled', 'expired']))
  toState: Extract<TypeOrderState, 'awaiting_payment' | 'paid' | 'cancelled' | 'expired'>;

  @Api.field(v.optional(), v.tableIdentity())
  actorId?: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;
}
