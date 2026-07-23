import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsPaymentOutcomeResult extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaymentOutcomeResult>()
export class DtoPaymentOutcomeResult {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  paymentAttemptId: TableIdentity;

  @Api.field(z.enum(['paid', 'cancelled', 'expired']))
  orderState: 'paid' | 'cancelled' | 'expired';

  @Api.field(z.enum(['succeeded', 'failed', 'cancelled']))
  paymentAttemptState: 'succeeded' | 'failed' | 'cancelled';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  payableTotalCents: number;
}
