import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStockBalance } from '../model/stockBalance.ts';

export const stockBalanceQuery = $defineQuery(() => ModelStockBalance, {
  name: 'CommerceStockBalanceSelect',
  fields: {
    skuId: { operators: ['eq'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'skuId', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsStockBalanceSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockBalanceSelectReq>({
  query: stockBalanceQuery,
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
export class DtoStockBalanceSelectReq extends $Dto.queryPage(stockBalanceQuery, [
  'skuId',
  'createdAt',
]) {}
