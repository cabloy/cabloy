import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsCategory extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsCategory>('testVonaCategory')
export class EntityCategory extends EntityBase {
  @Api.field()
  name: string;

  @Api.field(v.optional(), v.tableIdentity())
  categoryIdParent?: TableIdentity;
}
