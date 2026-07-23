import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { DtoOrderAddressSnapshot } from './orderAddressSnapshot.tsx';
import { DtoOrderCouponSnapshot } from './orderCouponSnapshot.tsx';
import { DtoOrderLineSkuAttributeSnapshot } from './orderLineSkuAttributeSnapshot.tsx';

export interface IDtoOptionsOrderDetail extends IDecoratorDtoOptions {}

class DtoOrderDetailLine {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  skuCodeSnapshot: string;

  @Api.field(v.required())
  titleSnapshot: string;

  @Api.field(v.array(DtoOrderLineSkuAttributeSnapshot))
  skuAttributesSnapshot: DtoOrderLineSkuAttributeSnapshot[];

  @Api.field(z.number().int().nonnegative())
  unitPriceCents: number;

  @Api.field(z.number().int().positive())
  quantity: number;

  @Api.field(z.number().int().nonnegative())
  lineTotalCents: number;
}

@Dto<IDtoOptionsOrderDetail>()
export class DtoOrderDetail {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(z.enum(['awaiting_payment', 'paid', 'cancelled', 'expired']))
  state: 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';

  @Api.field(z.literal('USD'))
  currency: 'USD';

  @Api.field(z.number().int().nonnegative())
  eligibleSubtotalCents: number;

  @Api.field(z.number().int().nonnegative())
  discountCents: number;

  @Api.field(z.number().int().nonnegative())
  payableTotalCents: number;

  @Api.field(v.required())
  reservationExpiresAt: Date;

  @Api.field(v.object(DtoOrderAddressSnapshot))
  addressSnapshot: DtoOrderAddressSnapshot;

  @Api.field(v.optional(), v.object(DtoOrderCouponSnapshot))
  couponSnapshot?: DtoOrderCouponSnapshot;

  @Api.field(v.array(DtoOrderDetailLine))
  lines: DtoOrderDetailLine[];
}
