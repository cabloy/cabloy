import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelOrderLine } from '../model/orderLine.ts';

const currencyRendererOptions = { fixed: 2, exp: 2, zero: 2 };

export interface IDtoOptionsOrderAdminLineBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderAdminLineBase>({
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    skuCodeSnapshot: $makeMetadata(v.title($locale('SkuCodeSnapshot')), ZovaRender.order(2)),
    titleSnapshot: $makeMetadata(v.title($locale('TitleSnapshot')), ZovaRender.order(3)),
    skuAttributesSnapshot: $makeMetadata(
      v.title($locale('SkuAttributesSnapshot')),
      ZovaRender.order(4),
    ),
    unitPriceCents: $makeMetadata(
      v.title($locale('UnitPriceCents')),
      ZovaRender.order(5),
      ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
      ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    ),
    quantity: $makeMetadata(v.title($locale('Quantity')), ZovaRender.order(6)),
    eligibleSubtotalCents: $makeMetadata(
      v.title($locale('EligibleSubtotalCents')),
      ZovaRender.order(7),
      ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
      ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    ),
    lineTotalCents: $makeMetadata(
      v.title($locale('LineTotalCents')),
      ZovaRender.order(8),
      ZovaRender.field('basic-currency:formFieldCurrency', currencyRendererOptions),
      ZovaRender.cell('basic-currency:currency', currencyRendererOptions),
    ),
  },
})
export class DtoOrderAdminLineBase extends $Dto.get(() => ModelOrderLine, {
  columns: [
    'id',
    'skuCodeSnapshot',
    'titleSnapshot',
    'skuAttributesSnapshot',
    'unitPriceCents',
    'quantity',
    'eligibleSubtotalCents',
    'lineTotalCents',
  ],
}) {}
