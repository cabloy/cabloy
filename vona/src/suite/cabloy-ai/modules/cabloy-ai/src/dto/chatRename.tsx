import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatRename extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatRename>()
export class DtoChatRename {
  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), z.string().trim().min(1).max(120))
  title: string;
}
