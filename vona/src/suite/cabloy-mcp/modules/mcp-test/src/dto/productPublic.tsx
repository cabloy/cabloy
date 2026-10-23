import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { DtoProductPublicSku } from './productPublicSku.tsx';

export interface IDtoOptionsProductPublic extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublic>()
export class DtoProductPublic {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  title: string;

  @Api.field(v.optional())
  description?: string;

  @Api.field(v.tableIdentity())
  categoryId: TableIdentity;

  @Api.field(v.required())
  categoryName: string;

  @Api.field(z.number().int().nonnegative())
  priceCents: number;

  @Api.field(z.number().int().positive())
  available: number;

  @Api.field(v.required(), v.array(DtoProductPublicSku))
  skuAvailables: DtoProductPublicSku[];
}
