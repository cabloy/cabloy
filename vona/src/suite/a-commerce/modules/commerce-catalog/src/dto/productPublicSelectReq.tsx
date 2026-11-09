import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $defineQuery } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { ModelProduct } from '../model/product.ts';

export const productPublicQuery = $defineQuery(() => ModelProduct, {
  name: 'CommerceProductPublicSelect',
  fields: {
    categoryId: { operators: ['eq'] },
    title: { operators: ['containsI'] },
  },
  orderable: [],
  defaults: { orders: [{ field: 'id', direction: 'asc' }], pageNo: 1, pageSize: 20 },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsProductPublicSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublicSelectReq>()
export class DtoProductPublicSelectReq {
  @Api.field(z.number().min(1).default(1))
  pageNo: number;

  @Api.field(z.number().min(1).max(100).default(20))
  pageSize: number;

  @Api.field(v.optional(), v.tableIdentity())
  categoryId?: TableIdentity;

  @Api.field(v.optional(), z.string().min(1).max(200))
  title?: string;
}
