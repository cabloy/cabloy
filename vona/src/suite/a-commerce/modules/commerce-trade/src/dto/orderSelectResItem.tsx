import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { orderStateItems } from '../entity/order.tsx';
import { ModelOrder } from '../model/order.ts';

const currencyRendererOptions = { fixed: 2, exp: 2, zero: 2 };

export interface IDtoOptionsOrderSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectResItem>({
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
                      { type: 'field', name: 'state' },
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
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core'), ZovaRender.cell('basic-table:actionView')),
    state: $makeMetadata(
      v.title($locale('OrderState')),
      ZovaRender.order(2),
      ZovaRender.cell('basic-select:select', { items: orderStateItems }),
    ),
    payableTotalCents: $makeMetadata(
      v.title($locale('PayableTotalCents')),
      ZovaRender.order(3),
      ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    ),
    reservationExpiresAt: $makeMetadata(
      v.title($locale('ReservationExpiresAt')),
      ZovaRender.order(4),
      ZovaRender.cell('basic-date:date'),
    ),
    createdAt: $makeMetadata(ZovaRender.order(5), ZovaRender.cell('basic-date:date')),
  },
})
export class DtoOrderSelectResItem extends $Dto.get(() => ModelOrder, {
  columns: ['id', 'state', 'payableTotalCents', 'reservationExpiresAt', 'createdAt'],
}) {
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
