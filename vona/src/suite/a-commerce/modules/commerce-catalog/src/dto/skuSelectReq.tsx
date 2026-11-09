import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelSku } from '../model/sku.ts';

export const skuQuery = $defineQuery(() => ModelSku, {
  name: 'CommerceSkuSelect',
  fields: {
    code: { operators: ['eq', 'containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'code', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsSkuSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuSelectReq>({
  query: skuQuery,
  fields: {
    code: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoSkuSelectReq extends $Dto.queryPage(skuQuery, ['code', 'createdAt']) {}
