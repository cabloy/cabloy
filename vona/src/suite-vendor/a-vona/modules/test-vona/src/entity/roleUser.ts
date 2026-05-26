import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsRoleUser extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRoleUser>('testVonaRoleUser')
export class EntityRoleUser extends EntityBase {
  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.tableIdentity())
  roleId: TableIdentity;
}
