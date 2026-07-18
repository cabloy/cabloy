import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsProduct extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsProduct>('commerceCatalogProduct', {
  openapi: { title: $locale('Product') },
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
export class EntityProduct extends EntityBase {
  @Api.field(
    v.title($locale('ProductTitle')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  title: string;

  @Api.field(v.title($locale('Category')), v.required(), ZovaRender.order(2), v.tableIdentity())
  categoryId: TableIdentity;

  @Api.field(v.title($locale('Published')), v.default(false), ZovaRender.order(3))
  published: boolean;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(4))
  description?: string;
}
