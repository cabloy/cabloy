import type { ConfigDatabaseClient, IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api } from 'vona-module-a-openapiutils';
import { Entity, EntityBaseSimple } from 'vona-module-a-orm';

export interface IEntityOptionsDatasource extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsDatasource>('aDatasource')
export class EntityDatasource extends EntityBaseSimple {
  @Api.field()
  name: string;

  @Api.field()
  description: string;

  @Api.field()
  config: ConfigDatabaseClient;
}
