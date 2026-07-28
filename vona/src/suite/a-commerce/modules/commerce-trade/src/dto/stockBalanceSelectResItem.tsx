import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStockBalance } from '../model/stockBalance.ts';

export interface IDtoOptionsStockBalanceSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockBalanceSelectResItem>({
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
export class DtoStockBalanceSelectResItem extends $Dto.get(() => ModelStockBalance) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [ZovaRender.tableActionRow('basic-table:actionView')],
    }),
  )
  _operationsRow?: unknown;
}
