import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { ModelOrder } from '../model/order.ts';

export const orderMineQuery = $defineQuery(() => ModelOrder, {
  name: 'CommerceOrderMine',
  fields: {
    state: { operators: ['eq'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'state', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  conveniences: { state: { field: 'state', op: 'eq' } },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsOrderMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderMineReq>({
  query: orderMineQuery,
  fields: {
    state: $makeSchema(
      v.optional(),
      z.enum(['awaiting_payment', 'paid', 'shipped', 'cancelled', 'expired']),
    ),
    createdAt: $makeSchema(v.optional(), v.filterTransform('a-web:dateRange'), z.string()),
  },
})
export class DtoOrderMineReq extends $Dto.queryPage(orderMineQuery, ['state', 'createdAt']) {}
