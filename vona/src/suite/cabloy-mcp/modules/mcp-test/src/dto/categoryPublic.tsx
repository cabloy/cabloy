import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsCategoryPublic extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategoryPublic>()
export class DtoCategoryPublic {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  name: string;

  @Api.field(v.optional())
  description?: string;
}
