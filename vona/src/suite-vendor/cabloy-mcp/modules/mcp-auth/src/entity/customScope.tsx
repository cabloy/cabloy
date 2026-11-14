import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import type { IMcpToolIdentity, TypeMcpCustomScope } from '../types/index.ts';

import { $locale } from '../.metadata/locales.ts';
import { DtoMcpToolIdentity } from '../dto/mcpTool.ts';
import { mcpCustomScopePattern } from '../lib/authorization.ts';

export interface IEntityOptionsCustomScope extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCustomScope>('mcpAuthCustomScope')
export class EntityCustomScope extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.string().url().max(2048))
  resource: string;

  @Api.field(z.string().regex(mcpCustomScopePattern))
  scope: TypeMcpCustomScope;

  @Api.field(
    v.title($locale('Name')),
    v.description($locale('CustomScopeNameHelp')),
    // OpenAPI carries the raw-input pattern, but not Zod's trim transform.
    z
      .string()
      .regex(/^\s*[\w-]{1,100}\s*$/)
      .trim(),
  )
  name: string;

  @Api.field(v.title($locale('Description')), z.string().max(1000))
  description: string;

  @Api.field(v.title($locale('Tools')), v.array(v.object(DtoMcpToolIdentity)), v.min(1), v.max(256))
  tools: IMcpToolIdentity[];
}
