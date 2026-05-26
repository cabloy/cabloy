import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $Class } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';

export interface IEntityOptionsVersionInit extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsVersionInit>('aVersionInit')
export class EntityVersionInit extends $Class.omit(EntityBaseSimple, ['iid', 'deleted']) {
  @Api.field()
  instanceName: string;

  @Api.field()
  module: string;

  @Api.field()
  version: number;
}
