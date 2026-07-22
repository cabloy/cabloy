import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export type TypeStockReservationState = 'reserved' | 'consumed' | 'released' | 'restored';

export interface IEntityOptionsStockReservation extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStockReservation>('commerceTradeStockReservation', {
  openapi: { title: $locale('StockReservation') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
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
export class EntityStockReservation extends EntityBase {
  @Api.field(
    v.title($locale('StockBalanceId')),
    v.required(),
    v.tableIdentity(),
    ZovaRender.order(1),
  )
  stockBalanceId: TableIdentity;

  @Api.field(v.title($locale('SkuId')), v.required(), v.tableIdentity(), ZovaRender.order(2))
  skuId: TableIdentity;

  @Api.field(v.title($locale('OrderLineId')), v.optional(), v.tableIdentity(), ZovaRender.order(3))
  orderLineId?: TableIdentity;

  @Api.field(
    v.title($locale('Quantity')),
    v.required(),
    z.number().int().positive(),
    ZovaRender.order(4),
  )
  quantity: number;

  @Api.field(
    v.title($locale('ReservationState')),
    v.required(),
    z.enum(['reserved', 'consumed', 'released', 'restored']),
    ZovaRender.order(4),
  )
  state: TypeStockReservationState;

  @Api.field(v.title($locale('CorrelationId')), v.required(), v.min(1), ZovaRender.order(5))
  correlationId: string;
}
