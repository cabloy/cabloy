import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsStockAudit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStockAudit>('commerceTradeStockAudit', {
  openapi: { title: $locale('StockAudit') },
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
export class EntityStockAudit extends EntityBase {
  @Api.field(
    v.title($locale('StockBalanceId')),
    v.required(),
    v.tableIdentity(),
    ZovaRender.order(1),
  )
  stockBalanceId: TableIdentity;

  @Api.field(v.title($locale('SkuId')), v.required(), v.tableIdentity(), ZovaRender.order(2))
  skuId: TableIdentity;

  @Api.field(
    v.title($locale('StockReservationId')),
    v.optional(),
    v.tableIdentity(),
    ZovaRender.order(3),
  )
  stockReservationId?: TableIdentity;

  @Api.field(v.title($locale('ActorId')), v.optional(), v.tableIdentity(), ZovaRender.order(4))
  actorId?: TableIdentity;

  @Api.field(
    v.title($locale('StockOperation')),
    v.required(),
    z.enum(['adjust', 'reserve', 'consume', 'release', 'restore']),
    ZovaRender.order(5),
  )
  operation: 'adjust' | 'reserve' | 'consume' | 'release' | 'restore';

  @Api.field(v.title($locale('Delta')), v.required(), z.int(), ZovaRender.order(6))
  delta: number;

  @Api.field(v.title($locale('Reason')), v.required(), v.min(1), ZovaRender.order(7))
  reason: string;

  @Api.field(v.title($locale('CorrelationId')), v.required(), v.min(1), ZovaRender.order(8))
  correlationId: string;

  @Api.field(
    v.title($locale('PriorOnHand')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(9),
  )
  priorOnHand: number;

  @Api.field(
    v.title($locale('PriorReserved')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(10),
  )
  priorReserved: number;

  @Api.field(
    v.title($locale('PriorAvailable')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(11),
  )
  priorAvailable: number;

  @Api.field(
    v.title($locale('OnHand')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(12),
  )
  onHand: number;

  @Api.field(
    v.title($locale('Reserved')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(13),
  )
  reserved: number;

  @Api.field(
    v.title($locale('Available')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(14),
  )
  available: number;
}
