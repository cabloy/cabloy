import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatConversation extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatConversation>()
export class DtoChatConversation {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required(), z.string())
  title: string;

  @Api.field(v.tableIdentity(), v.optional(), v.nullable())
  activeRunId: TableIdentity | null;
}
