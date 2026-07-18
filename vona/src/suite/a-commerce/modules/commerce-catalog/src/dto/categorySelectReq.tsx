import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityCategory } from '../entity/category.tsx';

export interface IDtoOptionsCategorySelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategorySelectReq>({
  openapi: { filter: { table: 'commerceCatalogCategory' } },
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
export class DtoCategorySelectReq extends $Dto.queryPage(EntityCategory, ['name', 'createdAt']) {}
