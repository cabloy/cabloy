import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { TypePaymentNextAction, TypePaymentSessionState } from '../types/payment.ts';

export interface IEntityOptionsPaymentSession extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPaymentSession>('payPaymentSession')
export class EntityPaymentSession extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.string())
  payScene: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  businessReference: string;

  @Api.field(z.string())
  providerName: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  clientName: string;

  @Api.field(z.enum(['sandbox', 'live']))
  environment: 'sandbox' | 'live';

  @Api.field(z.number().int().nonnegative())
  amountMinor: number;

  @Api.field(v.required(), v.min(3), v.max(3))
  currency: string;

  @Api.field(
    z.enum([
      'created',
      'starting',
      'requires_action',
      'processing',
      'succeeded',
      'failed',
      'cancelled',
      'expired',
    ]),
  )
  state: TypePaymentSessionState;

  @Api.field(v.optional())
  nextAction?: TypePaymentNextAction;

  @Api.field(v.optional(), v.max(255))
  providerPaymentId?: string;

  @Api.field(v.optional(), v.max(255))
  providerOrderId?: string;

  @Api.field(v.optional(), v.max(255))
  providerCaptureId?: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;

  @Api.field(v.required())
  expiresAt: Date;

  @Api.field(v.optional())
  finalizedAt?: Date;
}
