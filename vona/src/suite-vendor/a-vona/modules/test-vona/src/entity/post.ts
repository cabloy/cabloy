import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsPost extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsPost>('testVonaPost')
export class EntityPost extends EntityBase {
  @Api.field(v.title($locale('Title')))
  title: string;

  @Api.field(v.tableIdentity())
  userId: TableIdentity;

  @Api.field(v.optional())
  stars?: number;
}
