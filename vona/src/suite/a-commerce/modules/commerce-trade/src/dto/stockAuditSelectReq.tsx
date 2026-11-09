import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStockAudit } from '../model/stockAudit.ts';

export const stockAuditQuery = $defineQuery(() => ModelStockAudit, {
  name: 'CommerceStockAuditSelect',
  fields: {
    skuId: { operators: ['eq'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'skuId', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsStockAuditSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAuditSelectReq>({
  query: stockAuditQuery,
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
export class DtoStockAuditSelectReq extends $Dto.queryPage(stockAuditQuery, [
  'skuId',
  'createdAt',
]) {}
