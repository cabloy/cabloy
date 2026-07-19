import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStockAudit } from '../model/stockAudit.ts';

export interface IDtoOptionsStockAuditSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAuditSelectResItem>({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter'),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoStockAuditSelectResItem extends $Dto.get(() => ModelStockAudit) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [ZovaRender.tableActionRow('basic-table:actionView')],
    }),
  )
  _operationsRow?: unknown;
}
