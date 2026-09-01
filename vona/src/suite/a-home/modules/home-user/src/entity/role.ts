import type { IDecoratorEntityOptions } from 'vona-module-a-orm';
import type { LocalizedTextMap } from 'vona-module-a-user';
import type { IRole } from 'vona-module-a-user';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsRole extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRole>('homeRole', { openapi: { title: $locale('Role') } })
export class EntityRole extends EntityBase implements IRole {
  @Api.field(v.title($locale('RoleName')))
  name: string;

  @Api.field(v.title($locale('RoleTitle')))
  title: string;

  @Api.field(v.title($locale('RoleLocales')), v.optional(), z.record(z.string(), z.string()))
  titleLocales?: LocalizedTextMap;

  @Api.field(v.array(z.string()))
  siteIds: string[];

  @Api.field(v.default(false))
  builtin: boolean;
}
