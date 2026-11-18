import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsChatHistoryRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatHistoryRequest>()
export class DtoChatHistoryRequest {
  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;
}
