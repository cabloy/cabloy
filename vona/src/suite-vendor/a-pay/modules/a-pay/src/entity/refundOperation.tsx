import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypeRefundOperationState } from '../types/payment.ts';

export interface IEntityOptionsRefundOperation extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRefundOperation>('payRefundOperation')
export class EntityRefundOperation extends EntityBase {
  @Api.field(v.tableIdentity())
  paymentSessionId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(100))
  businessReference: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  providerInvoiceReference: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  providerCorrelationReference: string;

  @Api.field(z.number().int().positive())
  amountMinor: number;

  @Api.field(v.required(), v.min(3), v.max(3))
  currency: string;

  @Api.field(z.enum(['created', 'submitting', 'pending', 'succeeded', 'failed', 'cancelled']))
  state: TypeRefundOperationState;

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;

  @Api.field(v.optional(), v.max(255))
  providerRefundId?: string;

  @Api.field(v.optional())
  finalizedAt?: Date;
}
