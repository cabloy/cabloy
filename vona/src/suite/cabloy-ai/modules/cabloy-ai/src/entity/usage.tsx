import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsUsage extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsUsage>('cabloyAiUsage')
export class EntityUsage extends EntityBase {
  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  runId: TableIdentity;

  @Api.field(z.number().int().nonnegative().nullable())
  inputTokens: number | null;

  @Api.field(z.number().int().nonnegative().nullable())
  outputTokens: number | null;

  @Api.field(z.number().int().nonnegative().nullable())
  totalTokens: number | null;

  @Api.field(z.number().int().nonnegative().nullable())
  cacheReadTokens: number | null;

  @Api.field(z.number().int().nonnegative().nullable())
  cacheWriteTokens: number | null;
}
