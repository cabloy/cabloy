import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsShipmentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsShipmentView>()
export class DtoShipmentView {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  carrier: string;

  @Api.field(v.required())
  trackingNumber: string;

  @Api.field(v.required())
  shippedAt: Date;
}
