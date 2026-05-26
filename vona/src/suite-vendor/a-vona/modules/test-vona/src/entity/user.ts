import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsUser extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsUser>('testVonaUser')
export class EntityUser extends EntityBase {
  @Api.field()
  name: string;

  @Api.field(v.optional())
  age?: number;

  @Api.field(v.optional())
  scores?: number;
}
