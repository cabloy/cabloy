import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsPaymentAttemptView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaymentAttemptView>()
export class DtoPaymentAttemptView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(z.enum(['created', 'cancelled']))
  state: 'created' | 'cancelled';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  amountCents: number;
}
