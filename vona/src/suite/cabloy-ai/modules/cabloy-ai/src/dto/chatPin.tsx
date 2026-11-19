import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatPin extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatPin>()
export class DtoChatPin {
  @Api.field(v.required(), z.string().trim().min(1).max(255))
  ssrSiteId: string;

  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), z.boolean())
  pinned: boolean;
}
