import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelCouponTemplate } from '../model/couponTemplate.ts';

export const couponTemplateQuery = $defineQuery(() => ModelCouponTemplate, {
  name: 'CommerceCouponTemplateSelect',
  fields: {
    name: { operators: ['eq', 'containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsCouponTemplateSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateSelectReq>({
  query: couponTemplateQuery,
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
export class DtoCouponTemplateSelectReq extends $Dto.queryPage(couponTemplateQuery, [
  'name',
  'createdAt',
]) {}
