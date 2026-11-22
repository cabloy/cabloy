import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsRun extends IDecoratorEntityOptions {}
export type TypeChatRunStatus = 'running' | 'completed' | 'failed' | 'aborted' | 'interrupted';

@Entity<IEntityOptionsRun>('cabloyAiRun')
export class EntityRun extends EntityBase {
  @Api.field(v.required(), v.tableIdentity())
  conversationId: TableIdentity;

  @Api.field(v.required(), v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.required(), z.string().min(1).max(100))
  requestKey: string;

  @Api.field(v.required(), z.string().length(64))
  fingerprint: string;

  @Api.field(v.required(), z.enum(['running', 'completed', 'failed', 'aborted', 'interrupted']))
  status: TypeChatRunStatus;

  @Api.field(v.required(), z.number().int())
  deadlineAt: number;

  @Api.field(z.number().int().nullable())
  finishedAt: number | null;

  @Api.field(z.string().max(40).nullable())
  errorCode: string | null;

  @Api.field(z.string().max(100))
  aiScene: string;

  @Api.field(z.string().max(100))
  aiProvider: string;

  @Api.field(z.string().max(100))
  aiModel: string;

  @Api.field(z.string().max(200))
  modelId: string;
}
