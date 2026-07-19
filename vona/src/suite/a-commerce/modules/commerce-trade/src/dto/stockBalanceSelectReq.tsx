import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityStockBalance } from '../entity/stockBalance.tsx';

export interface IDtoOptionsStockBalanceSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockBalanceSelectReq>({
  openapi: { filter: { table: 'commerceTradeStockBalance' } },
  fields: {
    skuId: $makeSchema(v.optional(), v.tableIdentity()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoStockBalanceSelectReq extends $Dto.queryPage(EntityStockBalance, [
  'skuId',
  'createdAt',
]) {}
