import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import type { IMenuItem, IMenuItemMeta } from '../types/menu.ts';

import { DtoMenuItemMeta } from './menuItemMeta.ts';

export interface IDtoOptionsMenuItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMenuItem>()
export class DtoMenuItem implements IMenuItem {
  @Api.field()
  name: string;

  @Api.field(v.optional())
  title?: string;

  @Api.field(v.optional())
  description?: string;

  @Api.field(v.optional())
  icon?: string;

  @Api.field(v.optional())
  order?: number;

  @Api.field(v.optional(), z.union([z.string(), z.array(z.string())]))
  group?: string | string[];

  @Api.field(v.optional())
  separator?: boolean;

  @Api.field(v.optional(), z.string())
  link?: string;

  @Api.field(v.optional())
  external?: boolean;

  @Api.field(v.optional())
  target?: string;

  @Api.field(v.optional(), v.object(DtoMenuItemMeta))
  meta?: IMenuItemMeta;
}
