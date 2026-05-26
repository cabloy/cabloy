import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import type { IMenuItemMetaParams, IMenuItemMetaQuery } from '../types/menu.ts';

import { DtoMenuItemMetaParams } from './menuItemMetaParams.ts';
import { DtoMenuItemMetaQuery } from './menuItemMetaQuery.ts';

export interface IDtoOptionsMenuItemMeta extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMenuItemMeta>()
export class DtoMenuItemMeta {
  @Api.field(v.optional(), v.object(DtoMenuItemMetaParams))
  params?: IMenuItemMetaParams;

  @Api.field(v.optional(), v.object(DtoMenuItemMetaQuery))
  query?: IMenuItemMetaQuery;
}
