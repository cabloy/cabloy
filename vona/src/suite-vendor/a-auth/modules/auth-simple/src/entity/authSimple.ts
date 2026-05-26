import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

export interface IEntityOptionsAuthSimple extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsAuthSimple>('aAuthSimple')
export class EntityAuthSimple extends EntityBase {
  @Api.field()
  hash: string;
}
