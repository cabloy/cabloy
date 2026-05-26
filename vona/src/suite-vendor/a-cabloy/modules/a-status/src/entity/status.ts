import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';

export interface IEntityOptionsStatus extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStatus>('aStatus')
export class EntityStatus extends EntityBaseSimple {
  @Api.field()
  module: string;

  @Api.field()
  name: string;

  @Api.field()
  value: any;
}
