import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsProduct extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsProduct>('testVonaProduct', { independent: true })
export class EntityProduct extends EntityBase {
  @Api.field(v.title($locale('Name')))
  name: string;

  @Api.field(v.title($locale('Price')))
  price: number;

  @Api.field(v.title($locale('Quantity')))
  quantity: number;

  @Api.field(v.title($locale('Amount')))
  amount: number;

  @Api.field(v.tableIdentity())
  orderId: TableIdentity;
}
