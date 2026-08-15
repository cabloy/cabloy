import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { EntityStockAudit } from '../entity/stockAudit.tsx';
import { ModelStockAudit } from '../model/stockAudit.ts';
import { DtoStockSkuRef } from './stockSkuRef.tsx';

export interface IDtoOptionsStockAuditSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAuditSelectResItem>({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter', {
          formFieldLayout: { inline: true },
          blocks: [
            ZovaRender.block('basic-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'section',
                    layout: 'flow',
                    children: [
                      { type: 'field', name: 'skuId' },
                      { type: 'field', name: 'createdAt' },
                      {
                        type: 'block',
                        block: ZovaRender.block('basic-page:blockFilterActions'),
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoStockAuditSelectResItem extends $Dto.get(() => ModelStockAudit, {
  columns: ['id', 'skuId', 'operation', 'delta', 'createdAt'],
}) {
  @Api.field(ZovaRender.order(1, 'core'), ZovaRender.cell('basic-table:actionView'))
  declare id: EntityStockAudit['id'];

  @Api.field(v.optional(), v.object(DtoStockSkuRef))
  sku?: DtoStockSkuRef;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [ZovaRender.tableActionRow('basic-table:actionView')],
    }),
  )
  _operationsRow?: unknown;
}
