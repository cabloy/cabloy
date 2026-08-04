import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsMockRefundReceipt extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMockRefundReceipt>()
export class DtoMockRefundReceipt {
  @Api.field(v.tableIdentity())
  refundOperationId: TableIdentity;

  @Api.field(v.required())
  accepted: true;
}
