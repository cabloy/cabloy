import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelOrder } from '../model/order.ts';

export interface IDtoOptionsOrderSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectResItem>({
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
export class DtoOrderSelectResItem extends $Dto.get(() => ModelOrder) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('commerce-trade:actionShip', {
          permission: { public: true },
        }),
        ZovaRender.tableActionRow('commerce-trade:actionRefund', {
          permission: { public: true },
        }),
        ZovaRender.tableActionRow('basic-table:actionView'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
