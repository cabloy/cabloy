import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, $resourceName, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoSkuAttribute } from '../dto/skuAttribute.tsx';

const currencyRendererOptions = { fixed: 2, exp: 2, zero: 2 };

export const skuLifecycleItems = [
  { value: 'draft', title: $locale('SkuLifecycleDraft') },
  { value: 'active', title: $locale('SkuLifecycleActive') },
  { value: 'inactive', title: $locale('SkuLifecycleInactive') },
  { value: 'archived', title: $locale('SkuLifecycleArchived') },
];

export interface IEntityOptionsSku extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsSku>('commerceCatalogSku', {
  openapi: { title: $locale('Sku') },
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
export class EntitySku extends EntityBase {
  @Api.field(
    v.title($locale('SkuCode')),
    v.required(),
    v.min(1),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  code: string;

  @Api.field(
    v.title($locale('Product')),
    v.required(),
    ZovaRender.order(2),
    ZovaRender.field('basic-resource:formFieldResourcePicker', {
      resource: $resourceName('commerce-catalog:product'),
      relationName: 'product',
      selectOptions: { itemValue: 'id', itemTitle: 'title' },
    }),
    ZovaRender.cell('basic-resource:resourcePicker', {
      resource: $resourceName('commerce-catalog:product'),
      relationName: 'product',
      selectOptions: { itemValue: 'id', itemTitle: 'title' },
    }),
    v.tableIdentity(),
  )
  productId: TableIdentity;

  @Api.field(
    v.title($locale('PriceCents')),
    v.required(),
    ZovaRender.order(3),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    z.number().int().nonnegative(),
  )
  priceCents: number;

  @Api.field(
    v.title($locale('SkuAttributes')),
    v.default([]),
    v.array(v.object(DtoSkuAttribute)),
    ZovaRender.order(4),
  )
  attributes: DtoSkuAttribute[];

  @Api.field(
    v.title($locale('SkuLifecycle')),
    v.default('draft'),
    ZovaRender.order(5),
    ZovaRender.field('basic-select:formFieldSelect', { items: skuLifecycleItems }),
    ZovaRender.cell('basic-select:select', { items: skuLifecycleItems }),
    z.enum(['draft', 'active', 'inactive', 'archived']),
  )
  lifecycle: 'draft' | 'active' | 'inactive' | 'archived';
}
