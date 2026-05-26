import type { ILocaleRecord } from 'vona';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';
import type { IUser } from 'vona-module-a-user';

import { Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsUser extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsUser>('homeUser', { openapi: { title: $locale('User') } })
export class EntityUser extends EntityBase implements IUser {
  @Api.field(v.title($locale('UserName')))
  name: string;

  @Api.field(v.title($locale('UserAvatar')), v.optional())
  avatar?: string;

  @Api.field(v.title($locale('UserEmail')), v.optional())
  email?: string;

  @Api.field(v.title($locale('UserMobile')), v.optional())
  mobile?: string;

  @Api.field(v.title($locale('UserActivated')), v.default(false))
  activated?: boolean;

  @Api.field(v.title($locale('UserLocale')), z.string().optional())
  locale?: keyof ILocaleRecord | undefined;

  @Api.field(v.title($locale('UserTz')), v.optional())
  tz?: string;
}
