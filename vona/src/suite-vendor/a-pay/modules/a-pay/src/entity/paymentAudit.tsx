import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import type { TypePaymentSessionState } from '../types/payment.ts';

export interface IEntityOptionsPaymentAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPaymentAudit>('payPaymentAudit')
export class EntityPaymentAudit extends EntityBase {
  @Api.field(v.tableIdentity())
  paymentSessionId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  providerOperationId?: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  webhookInboxId?: TableIdentity;

  @Api.field(v.optional())
  fromState?: TypePaymentSessionState;

  @Api.field()
  toState: TypePaymentSessionState;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  source: string;

  @Api.field(v.required())
  occurredAt: Date;
}
