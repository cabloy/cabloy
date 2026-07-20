import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { $locale } from '../.metadata/locales.ts';
import { DtoProductPublicSku } from './productPublicSku.tsx';

export interface IDtoOptionsProductPublic extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublic>()
export class DtoProductPublic {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('ProductTitle')), v.required())
  title: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;

  @Api.field(v.title($locale('Category')), v.required(), v.tableIdentity())
  categoryId: TableIdentity;

  @Api.field(v.title($locale('Name')), v.required())
  categoryName: string;

  @Api.field(v.title($locale('PriceCents')), v.required(), z.number().int().nonnegative())
  priceCents: number;

  @Api.field(v.title($locale('Available')), v.required(), z.number().int().positive())
  available: number;

  @Api.field(v.required(), v.array(DtoProductPublicSku))
  skuAvailables: DtoProductPublicSku[];
}
