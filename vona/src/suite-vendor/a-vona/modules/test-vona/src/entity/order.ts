import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsOrder extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsOrder>('testVonaOrder', { openapi: { title: $locale('Order') } })
export class EntityOrder extends EntityBase {
  @Api.field(v.openapi({ title: $locale('OrderNo') }), v.default(''), v.min(3))
  orderNo: string;

  @Api.field(v.openapi({ title: $locale('Remark') }), v.optional())
  remark?: string;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;
}
