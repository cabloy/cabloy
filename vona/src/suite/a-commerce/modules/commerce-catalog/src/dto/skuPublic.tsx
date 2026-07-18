import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsSkuPublic extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuPublic>()
export class DtoSkuPublic {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('SkuCode')), v.required())
  code: string;

  @Api.field(v.title($locale('Product')), v.required(), v.tableIdentity())
  productId: TableIdentity;

  @Api.field(v.title($locale('PriceCents')), v.required(), z.number().int().nonnegative())
  priceCents: number;
}
