import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsStockAdjust extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAdjust>({ openapi: { title: $locale('AdjustStock') } })
export class DtoStockAdjust {
  @Api.field(v.title($locale('SkuId')), v.required(), v.tableIdentity())
  skuId: TableIdentity;

  @Api.field(
    v.title($locale('Delta')),
    v.required(),
    z
      .number()
      .int()
      .refine(value => value !== 0),
  )
  delta: number;

  @Api.field(v.title($locale('Reason')), v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.title($locale('CorrelationId')), v.required(), v.min(1), v.max(100))
  correlationId: string;
}
