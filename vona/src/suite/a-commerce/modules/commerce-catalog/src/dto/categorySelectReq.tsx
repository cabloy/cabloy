import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelCategory } from '../model/category.ts';

export const categoryQuery = $defineQuery(() => ModelCategory, {
  name: 'CommerceCategorySelect',
  fields: {
    name: { operators: ['eq', 'containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsCategorySelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategorySelectReq>({
  query: categoryQuery,
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
export class DtoCategorySelectReq extends $Dto.queryPage(categoryQuery, ['name', 'createdAt']) {}
