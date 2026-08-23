import type { ILocaleRecord } from 'vona';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsAccountProfileUpdate extends IDecoratorDtoOptions {}

const avatar = z
  .string()
  .max(255)
  .refine(
    value => {
      if (value.startsWith('/api/') || value.startsWith('/public/')) return true;
      try {
        return new URL(value).protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Avatar URL must be an absolute HTTPS URL or API delivery URL' },
  );
const avatarSchema = avatar.openapi({
  description: 'Absolute HTTPS avatar URL or API delivery URL',
});

@Dto<IDtoOptionsAccountProfileUpdate>()
export class DtoAccountProfileUpdate {
  @Api.field(v.title($locale('AccountDisplayName')), v.min(1), v.max(100), v.trim())
  name: string;

  @Api.field(v.title($locale('AccountAvatar')), v.optional(), v.nullable(), avatarSchema)
  avatar?: string | null;

  @Api.field(
    v.title($locale('AccountLocale')),
    v.optional(),
    v.nullable(),
    z.string().trim().min(1).max(64),
  )
  locale?: keyof ILocaleRecord | null;

  @Api.field(
    v.title($locale('AccountTimezone')),
    v.optional(),
    v.nullable(),
    z.string().trim().min(1).max(64),
  )
  tz?: string | null;
}
