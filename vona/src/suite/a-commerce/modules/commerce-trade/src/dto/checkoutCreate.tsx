import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsCheckoutCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCheckoutCreate>()
export class DtoCheckoutCreate {
  @Api.field(v.required(), v.tableIdentity())
  addressId: TableIdentity;

  @Api.field(v.optional(), v.tableIdentity())
  couponGrantId?: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(80))
  correlationId: string;

  @Api.field(v.optional(), v.min(1), v.max(100))
  providerCandidateKey?: string;
}
