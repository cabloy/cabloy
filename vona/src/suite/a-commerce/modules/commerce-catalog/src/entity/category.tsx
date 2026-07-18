import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsCategory extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCategory>('commerceCatalogCategory', {
  openapi: { title: $locale('Category') },
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
export class EntityCategory extends EntityBase {
  @Api.field(
    v.title($locale('Name')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('ParentCategory')),
    v.optional(),
    ZovaRender.order(2),
    v.tableIdentity(),
  )
  parentId?: TableIdentity;

  @Api.field(v.title($locale('Published')), v.default(false), ZovaRender.order(3))
  published: boolean;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(4))
  description?: string;
}
