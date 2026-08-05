import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRefundResult extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundResult>()
export class DtoRefundResult {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  refundRequestId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  refundAttemptId?: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  refundOperationId?: TableIdentity;

  @Api.field(z.enum(['paid', 'refund_requested', 'refund_approved', 'refund_rejected', 'refunded']))
  orderState: 'paid' | 'refund_requested' | 'refund_approved' | 'refund_rejected' | 'refunded';

  @Api.field(z.enum(['requested', 'approved', 'rejected', 'refunded', 'failed']))
  refundState: 'requested' | 'approved' | 'rejected' | 'refunded' | 'failed';

  @Api.field(v.optional(), z.enum(['created', 'succeeded', 'failed']))
  refundAttemptState?: 'created' | 'succeeded' | 'failed';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  amountCents: number;
}
