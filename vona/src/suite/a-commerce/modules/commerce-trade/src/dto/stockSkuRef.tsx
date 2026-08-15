import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsStockSkuRef extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockSkuRef>()
export class DtoStockSkuRef {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  code: string;
}
