import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { EntityOrder } from '../entity/order.tsx';

export interface IDtoOptionsOrderMineReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderMineReq>({
  fields: {
    state: $makeSchema(
      v.optional(),
      z.enum(['awaiting_payment', 'paid', 'shipped', 'cancelled', 'expired']),
    ),
    createdAt: $makeSchema(v.optional(), v.filterTransform('a-web:dateRange'), z.string()),
  },
})
export class DtoOrderMineReq extends $Dto.queryPage(EntityOrder, ['state', 'createdAt']) {}
