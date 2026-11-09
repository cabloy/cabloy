import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelProduct } from '../model/product.ts';

export const productQuery = $defineQuery(() => ModelProduct, {
  name: 'TestRestProductSelect',
  fields: {
    name: { operators: ['eq', 'containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsProductSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductSelectReq>({
  query: productQuery,
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoProductSelectReq extends $Dto.queryPage(productQuery, ['name', 'createdAt']) {}
