import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelCategory } from '../model/category.ts';

export interface IDtoOptionsCategorySelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategorySelectResItem>({
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
                      { type: 'field', name: 'name' },
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
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoCategorySelectResItem extends $Dto.get(() => ModelCategory) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('basic-table:actionUpdate'),
        ZovaRender.tableActionRow('basic-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
