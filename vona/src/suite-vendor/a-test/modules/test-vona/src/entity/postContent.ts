import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsPostContent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPostContent>('testVonaPostContent')
export class EntityPostContent extends EntityBase {
  @Api.field()
  content: string;

  @Api.field(v.tableIdentity())
  postId: TableIdentity;
}
