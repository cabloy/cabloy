import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import type { EntityOrder } from '../entity/order.tsx';

import { $locale } from '../.metadata/locales.ts';
import { orderStateItems } from '../entity/order.tsx';
import { ModelOrder } from '../model/order.ts';
import { DtoOrderAdminLineResItem } from './orderAdminLineResItem.tsx';

const currencyRendererOptions = { fixed: 2, exp: 2, zero: 2 };

export interface IDtoOptionsOrderView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderView>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('basic-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'group',
                    title: $locale('Order'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'id' },
                          { type: 'field', name: 'state' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderMoney'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'currency' },
                          { type: 'field', name: 'eligibleSubtotalCents' },
                          { type: 'field', name: 'discountCents' },
                          { type: 'field', name: 'payableTotalCents' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderReservation'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'reservationExpiresAt' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderAddress'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'addressSnapshot' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderCoupon'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'couponSnapshot' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderLines'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'lines' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderFulfillment'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'shipment' }],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('OrderDates'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'createdAt' },
                          { type: 'field', name: 'updatedAt' },
                        ],
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoOrderView extends $Dto.get(() => ModelOrder, {
  columns: [
    'id',
    'state',
    'currency',
    'eligibleSubtotalCents',
    'discountCents',
    'payableTotalCents',
    'reservationExpiresAt',
    'addressSnapshot',
    'couponSnapshot',
    'createdAt',
    'updatedAt',
  ],
  include: {
    shipment: true,
    lines: true,
  },
}) {
  @Api.field(
    v.title($locale('OrderState')),
    ZovaRender.order(2),
    ZovaRender.field('basic-select:formFieldSelect', { items: orderStateItems }),
    ZovaRender.cell('basic-select:select', { items: orderStateItems }),
  )
  declare state: EntityOrder['state'];

  @Api.field(v.title($locale('Currency')), ZovaRender.order(3))
  declare currency: EntityOrder['currency'];

  @Api.field(
    v.title($locale('EligibleSubtotalCents')),
    ZovaRender.order(4),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
  )
  declare eligibleSubtotalCents: number;

  @Api.field(
    v.title($locale('DiscountCents')),
    ZovaRender.order(5),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
  )
  declare discountCents: number;

  @Api.field(
    v.title($locale('PayableTotalCents')),
    ZovaRender.order(6),
    ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
    ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
  )
  declare payableTotalCents: number;

  @Api.field(
    v.title($locale('ReservationExpiresAt')),
    ZovaRender.order(7),
    ZovaRender.field('basic-date:formFieldDate'),
    ZovaRender.cell('basic-date:date'),
  )
  declare reservationExpiresAt: Date;

  @Api.field(
    v.title($locale('OrderLines')),
    ZovaRender.order(8),
    ZovaRender.field('basic-details:formFieldDetails'),
  )
  declare lines: DtoOrderAdminLineResItem[];

  @Api.field(
    ZovaRender.order(9),
    ZovaRender.field('basic-date:formFieldDate'),
    ZovaRender.cell('basic-date:date'),
  )
  declare createdAt: Date;

  @Api.field(
    ZovaRender.order(10),
    ZovaRender.field('basic-date:formFieldDate'),
    ZovaRender.cell('basic-date:date'),
  )
  declare updatedAt: Date;

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoOrderAdminLineResItem))
  _lines?: DtoOrderAdminLineResItem[];
}
