import type { IDecoratorEntityOptions } from 'vona-module-a-orm';
import type { IRole } from 'vona-module-a-user';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsRole extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRole>('homeRole', { openapi: { title: $locale('Role') } })
export class EntityRole extends EntityBase implements IRole {
  @Api.field(v.title($locale('RoleName')))
  name: string;
}
