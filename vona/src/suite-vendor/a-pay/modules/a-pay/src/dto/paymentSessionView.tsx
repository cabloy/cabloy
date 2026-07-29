import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

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

  @Api.field(v.optional())
  nextAction?:
    | { kind: 'redirect'; url: string }
    | { kind: 'embedded'; clientToken: string; publishableConfig?: Record<string, string> }
    | { kind: 'pending'; retryAfterSeconds?: number }
    | { kind: 'completed' };

  @Api.field(v.required(), z.number().int().nonnegative())
  amountMinor: number;

  @Api.field(v.required(), v.min(3), v.max(3))
  currency: string;
}
