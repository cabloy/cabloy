import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsTestParams extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsTestParams>()
export class DtoTestParams {
  @Api.field(v.optional(), v.tableIdentity())
  id?: TableIdentity;
}
