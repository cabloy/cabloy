import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsCartItem extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCartItem>('commerceTradeCartItem', {
  openapi: { title: $locale('CartItem') },
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class EntityCartItem extends EntityBase {
  @Api.field(v.tableIdentity())
  cartId: TableIdentity;

  @Api.field(v.tableIdentity())
  skuId: TableIdentity;

  @Api.field(v.required(), z.number().int().positive())
  quantity: number;
}
