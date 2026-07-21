import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsCartUpdateItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCartUpdateItem>({ openapi: { title: $locale('UpdateCartItem') } })
export class DtoCartUpdateItem {
  @Api.field(v.title($locale('Quantity')), v.required(), z.number().int().positive())
  quantity: number;
}
