import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelOrder } from '../model/order.ts';

export const orderQuery = $defineQuery(() => ModelOrder, {
  name: 'CommerceOrderSelect',
  fields: {
    state: { operators: ['eq', 'in'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'state', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  conveniences: { state: { field: 'state', op: 'eq' } },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsOrderSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectReq>({
  query: orderQuery,
  fields: {
    state: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoOrderSelectReq extends $Dto.queryPage(orderQuery, ['state', 'createdAt']) {}
