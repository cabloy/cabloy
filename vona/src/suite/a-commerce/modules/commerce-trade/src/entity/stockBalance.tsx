import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsStockBalance extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStockBalance>('commerceTradeStockBalance', {
  openapi: { title: $locale('StockBalance') },
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
export class EntityStockBalance extends EntityBase {
  @Api.field(v.title($locale('SkuId')), v.required(), v.tableIdentity(), ZovaRender.order(1))
  skuId: TableIdentity;

  @Api.field(v.title($locale('OnHand')), v.required(), z.number().int().min(0), ZovaRender.order(2))
  onHand: number;

  @Api.field(
    v.title($locale('Reserved')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(3),
  )
  reserved: number;

  @Api.field(
    v.title($locale('Available')),
    v.required(),
    z.number().int().min(0),
    ZovaRender.order(4),
  )
  available: number;
}
