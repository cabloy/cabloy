import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsCartAddItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCartAddItem>({ openapi: { title: $locale('AddCartItem') } })
export class DtoCartAddItem {
  @Api.field(v.title($locale('SkuId')), v.required(), v.tableIdentity())
  skuId: TableIdentity;

  @Api.field(v.title($locale('Quantity')), v.required(), z.number().int().positive())
  quantity: number;
}
