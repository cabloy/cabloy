import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsOrderSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSummary>()
export class DtoOrderSummary {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.enum(['awaiting_payment', 'paid', 'cancelled', 'expired']))
  state: 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  payableTotalCents: number;

  @Api.field(v.required())
  createdAt: Date;
}
