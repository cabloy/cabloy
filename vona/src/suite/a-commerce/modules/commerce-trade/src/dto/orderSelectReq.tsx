import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityOrder } from '../entity/order.tsx';

export interface IDtoOptionsOrderSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectReq>({
  openapi: { filter: { table: 'commerceTradeOrder' } },
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
export class DtoOrderSelectReq extends $Dto.queryPage(EntityOrder, ['state', 'createdAt']) {}
