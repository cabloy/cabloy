import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsCart extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCart>('commerceTradeCart', {
  openapi: { title: $locale('Cart') },
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    iid: $makeMetadata(ZovaRender.visible(false)),
    userId: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class EntityCart extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;
}
