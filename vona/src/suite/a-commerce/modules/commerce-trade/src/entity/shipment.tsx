import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsShipment extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsShipment>('commerceTradeShipment')
export class EntityShipment extends EntityBase {
  @Api.field(v.tableIdentity())
  orderId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(100))
  carrier: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  trackingNumber: string;

  @Api.field(v.tableIdentity())
  operatorId: TableIdentity;

  @Api.field(v.required())
  shippedAt: Date;

  @Api.field(v.required(), v.min(1), v.max(100))
  correlationId: string;
}
