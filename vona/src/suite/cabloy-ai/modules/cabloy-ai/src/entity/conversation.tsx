import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsConversation extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsConversation>('cabloyAiConversation')
export class EntityConversation extends EntityBase {
  @Api.field(v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.required(), z.string().trim().min(1).max(255))
  ssrSiteId: string;

  @Api.field(v.required(), z.string().max(120))
  title: string;

  @Api.field(v.tableIdentity(), v.optional(), v.nullable())
  activeRunId: TableIdentity | null;

  @Api.field(v.required(), z.boolean())
  pinned: boolean;
}
