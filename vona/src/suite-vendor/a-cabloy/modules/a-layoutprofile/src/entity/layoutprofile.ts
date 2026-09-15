import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

export interface IEntityOptionsLayoutprofile extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsLayoutprofile>('aLayoutProfile')
export class EntityLayoutprofile extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(z.string().trim().min(1).max(255))
  layoutKey: string;

  @Api.field(z.record(z.string(), z.unknown()))
  profile: Record<string, unknown>;
}
