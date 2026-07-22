import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsCouponMineItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponMineItem>()
export class DtoCouponMineItem {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(80))
  couponCode: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  templateName: string;

  @Api.field(v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(v.required(), z.number().int().positive())
  discountCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  minSpendCents: number;

  @Api.field(v.required())
  validUntil: Date;
}
