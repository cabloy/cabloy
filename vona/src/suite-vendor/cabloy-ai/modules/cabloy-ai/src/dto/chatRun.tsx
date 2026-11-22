import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import type { TypeChatRunStatus } from '../entity/run.tsx';

export interface IDtoOptionsChatRun extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsChatRun>()
export class DtoChatRun {
  @Api.field(v.required(), v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), z.string())
  requestKey: string;

  @Api.field(v.required(), z.enum(['running', 'completed', 'failed', 'aborted', 'interrupted']))
  status: TypeChatRunStatus;

  @Api.field(v.required(), z.number().int())
  deadlineAt: number;

  @Api.field(z.number().int().nullable())
  finishedAt: number | null;

  @Api.field(z.string().nullable())
  errorCode: string | null;
}
