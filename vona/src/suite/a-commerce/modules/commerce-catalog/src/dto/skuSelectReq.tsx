import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntitySku } from '../entity/sku.tsx';

export interface IDtoOptionsSkuSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuSelectReq>({
  openapi: { filter: { table: 'commerceCatalogSku' } },
  fields: {
    code: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoSkuSelectReq extends $Dto.queryPage(EntitySku, ['code', 'createdAt']) {}
