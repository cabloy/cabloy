import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsMockPaymentReceipt extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMockPaymentReceipt>()
export class DtoMockPaymentReceipt {
  @Api.field(v.tableIdentity())
  paymentSessionId: TableIdentity;

  @Api.field(v.required())
  accepted: true;
}
