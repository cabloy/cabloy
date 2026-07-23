import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsCouponIssue extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponIssue>()
export class DtoCouponIssue {
  @Api.field(v.required(), v.tableIdentity())
  templateId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.required(), v.min(1), v.max(80))
  correlationId: string;

  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;
}
