import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsOrderCouponSnapshot extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderCouponSnapshot>()
export class DtoOrderCouponSnapshot {
  @Api.field(v.required(), v.tableIdentity())
  couponGrantId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  couponTemplateId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(80))
  couponCode: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  templateName: string;

  @Api.field(v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(v.required(), z.number().int().positive())
  fixedDiscountCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  minSpendCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  appliedDiscountCents: number;
}
