import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsProductContent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsProductContent>('commerceCatalogProductContent', {
  openapi: { title: $locale('ProductContent') },
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(ZovaRender.visible(false)),
    updatedAt: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class EntityProductContent extends EntityBase {
  @Api.field(v.tableIdentity(), ZovaRender.visible(false))
  productId: TableIdentity;

  @Api.field(
    v.title($locale('DescriptionMarkdown')),
    v.optional(),
    ZovaRender.order(1),
    ZovaRender.field('basic-markdown:formFieldMarkdown'),
  )
  descriptionMarkdown?: string;

  @Api.field(v.title($locale('DescriptionHtml')), v.optional(), ZovaRender.visible(false))
  descriptionHtml?: string;
}
