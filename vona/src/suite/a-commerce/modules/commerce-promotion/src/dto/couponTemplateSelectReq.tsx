import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityCouponTemplate } from '../entity/couponTemplate.tsx';

export interface IDtoOptionsCouponTemplateSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateSelectReq>({
  openapi: { filter: { table: 'commercePromotionCouponTemplate' } },
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
export class DtoCouponTemplateSelectReq extends $Dto.queryPage(EntityCouponTemplate, [
  'name',
  'createdAt',
]) {}
