import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, $resourceName, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsCategory extends IDecoratorEntityOptions {}

export const categoryPublicationItems = [
  { value: false, title: $locale('Unpublished') },
  { value: true, title: $locale('Published') },
];

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
    ZovaRender.field('basic-resource:formFieldResourcePicker', {
      resource: $resourceName('commerce-catalog:category'),
      relationName: 'parent',
    }),
    ZovaRender.cell('basic-resource:resourcePicker', {
      resource: $resourceName('commerce-catalog:category'),
      relationName: 'parent',
    }),
    v.tableIdentity(),
  )
  parentId?: TableIdentity;

  @Api.field(
    v.title($locale('Published')),
    v.default(false),
    ZovaRender.order(3),
    ZovaRender.field('basic-select:formFieldSelect', { items: categoryPublicationItems }),
    ZovaRender.cell('basic-select:select', { items: categoryPublicationItems }),
  )
  published: boolean;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(4))
  description?: string;
}
