import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsProductPublicSku extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublicSku>()
export class DtoProductPublicSku {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('SkuCode')), v.required())
  code: string;

  @Api.field(v.title($locale('PriceCents')), v.required(), z.number().int().nonnegative())
  priceCents: number;

  @Api.field(v.title($locale('Available')), v.required(), z.number().int().positive())
  available: number;
}
