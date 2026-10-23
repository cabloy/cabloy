import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsProductPublicSku extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublicSku>()
export class DtoProductPublicSku {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.required())
  code: string;

  @Api.field(z.number().int().nonnegative())
  priceCents: number;

  @Api.field(z.number().int().positive())
  available: number;
}
