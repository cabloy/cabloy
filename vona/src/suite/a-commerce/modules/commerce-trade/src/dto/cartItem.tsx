import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsCartItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCartItem>({ openapi: { title: $locale('CartItem') } })
export class DtoCartItem {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.tableIdentity())
  skuId: TableIdentity;

  @Api.field(v.required(), z.number().int().positive())
  quantity: number;

  @Api.field(v.required())
  skuCode: string;

  @Api.field(v.required())
  productTitle: string;

  @Api.field(v.required(), z.number().int().nonnegative())
  priceCents: number;

  @Api.field(v.required(), z.number().int().positive())
  available: number;
}
