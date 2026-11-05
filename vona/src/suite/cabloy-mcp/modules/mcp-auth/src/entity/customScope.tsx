import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { IMcpToolIdentity, TypeMcpCustomScope } from '../types/index.ts';

import { $locale } from '../.metadata/locales.ts';
import { DtoMcpToolIdentity } from '../dto/mcpTool.ts';

export interface IEntityOptionsCustomScope extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCustomScope>('mcpAuthCustomScope')
export class EntityCustomScope extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.string().regex(/^mcp:custom:[\w-]{43}$/))
  scope: TypeMcpCustomScope;

  @Api.field(v.title($locale('Name')), z.string().trim().min(1).max(100))
  name: string;

  @Api.field(v.title($locale('Description')), z.string().max(1000))
  description: string;

  @Api.field(v.title($locale('Tools')), v.array(v.object(DtoMcpToolIdentity)), v.min(1), v.max(256))
  tools: IMcpToolIdentity[];
}
