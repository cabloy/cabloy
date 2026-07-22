import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsCouponTemplateCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateCreate>()
export class DtoCouponTemplateCreate {
  @Api.field(v.required(), v.min(2), v.max(100))
  name: string;

  @Api.field(v.required(), z.enum(['draft', 'active']))
  state: 'draft' | 'active';

  @Api.field(v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(v.required(), z.number().int().positive())
  discountCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  minSpendCents: number;

  @Api.field(v.required())
  validFrom: Date;

  @Api.field(v.required())
  validUntil: Date;

  @Api.field(v.optional(), z.number().int().positive())
  totalIssueLimit?: number;

  @Api.field(v.optional(), z.number().int().positive())
  totalUsageLimit?: number;

  @Api.field(v.optional(), z.number().int().positive())
  perCustomerIssueLimit?: number;

  @Api.field(v.optional(), v.max(255))
  description?: string;
}
