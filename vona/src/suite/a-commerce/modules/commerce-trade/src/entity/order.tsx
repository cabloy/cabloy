import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoOrderAddressSnapshot } from '../dto/orderAddressSnapshot.tsx';

export type TypeOrderState =
  | 'awaiting_payment'
  | 'paid'
  | 'refund_requested'
  | 'refund_approved'
  | 'refund_rejected'
  | 'shipped'
  | 'refunded'
  | 'cancelled'
  | 'expired';

export interface IEntityOptionsOrder extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOrder>('commerceTradeOrder', {
  openapi: { title: $locale('Order') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    userId: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
  },
})
export class EntityOrder extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.tableIdentity())
  addressId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(80))
  correlationId: string;

  @Api.field(v.object(DtoOrderAddressSnapshot))
  addressSnapshot: DtoOrderAddressSnapshot;

  @Api.field(
    z.enum([
      'awaiting_payment',
      'paid',
      'refund_requested',
      'refund_approved',
      'refund_rejected',
      'shipped',
      'refunded',
      'cancelled',
      'expired',
    ]),
  )
  state: TypeOrderState;

  @Api.field(v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(v.required(), z.number().int().nonnegative())
  eligibleSubtotalCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  discountCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  payableTotalCents: number;

  @Api.field(v.required())
  reservationExpiresAt: Date;
}
