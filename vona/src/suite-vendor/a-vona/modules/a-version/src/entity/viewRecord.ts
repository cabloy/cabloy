import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $Class } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';

export interface IEntityOptionsViewRecord extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsViewRecord>('aViewRecord')
export class EntityViewRecord extends $Class.omit(EntityBaseSimple, ['iid']) {
  @Api.field()
  viewName: string;

  @Api.field()
  viewSql: string;
}
