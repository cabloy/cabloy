import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsMessage extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsMessage>('cabloyAiMessage')
export class EntityMessage extends EntityBase {
  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  runId: TableIdentity;

  @Api.field(v.required(), z.enum(['user', 'assistant']))
  role: 'user' | 'assistant';

  @Api.field(v.required(), z.string())
  text: string;
}
