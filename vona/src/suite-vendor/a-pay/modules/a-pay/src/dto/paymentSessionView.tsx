import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import type { TypePaymentNextAction } from '../types/payment.ts';

const PaymentNextActionSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('redirect'),
    url: z.string().url(),
  }),
  z.object({
    kind: z.literal('embedded'),
    clientToken: z.string().min(1),
    publishableConfig: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    kind: z.literal('pending'),
    retryAfterSeconds: z.number().int().positive().optional(),
  }),
  z.object({
    kind: z.literal('completed'),
  }),
]);

export interface IDtoOptionsPaymentSessionView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaymentSessionView>()
export class DtoPaymentSessionView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

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
  state:
    | 'created'
    | 'starting'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
    | 'expired';

  @Api.field(v.required(), v.min(1), v.max(100))
  providerName: string;

  @Api.field(v.optional(), PaymentNextActionSchema)
  nextAction?: TypePaymentNextAction;

  @Api.field(v.required(), z.number().int().nonnegative())
  amountMinor: number;

  @Api.field(v.required(), v.min(3), v.max(3))
  currency: string;
}
