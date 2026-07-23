import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsCheckoutResult extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCheckoutResult>()
export class DtoCheckoutResult {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  paymentAttemptId: TableIdentity;

  @Api.field(z.literal('awaiting_payment'))
  state: 'awaiting_payment';

  @Api.field(z.literal('created'))
  paymentAttemptState: 'created';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  payableTotalCents: number;

  @Api.field(v.required())
  reservationExpiresAt: Date;
}
