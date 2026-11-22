import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsChatMessage extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatMessage>()
export class DtoChatMessage {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  runId: TableIdentity;

  @Api.field(v.required(), z.enum(['user', 'assistant']))
  role: 'user' | 'assistant';

  @Api.field(v.required(), z.string())
  text: string;
}
