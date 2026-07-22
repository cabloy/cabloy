import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoOrderLineSkuAttributeSnapshot } from '../dto/orderLineSkuAttributeSnapshot.tsx';

export interface IEntityOptionsOrderLine extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOrderLine>('commerceTradeOrderLine', {
  openapi: { title: $locale('OrderLine') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class EntityOrderLine extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.tableIdentity())
  skuId: TableIdentity;

  @Api.field(v.tableIdentity())
  productId: TableIdentity;

  @Api.field(v.required())
  skuCodeSnapshot: string;

  @Api.field(v.required())
  titleSnapshot: string;

  @Api.field(v.array(v.object(DtoOrderLineSkuAttributeSnapshot)))
  skuAttributesSnapshot: DtoOrderLineSkuAttributeSnapshot[];

  @Api.field(v.required(), z.number().int().nonnegative())
  unitPriceCents: number;

  @Api.field(v.required(), z.number().int().positive())
  quantity: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  eligibleSubtotalCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  lineTotalCents: number;
}
