import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStockBalance } from '../model/stockBalance.ts';
import { DtoStockSkuRef } from './stockSkuRef.tsx';

export interface IDtoOptionsStockBalanceView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockBalanceView>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoStockBalanceView extends $Dto.get(() => ModelStockBalance, {
  columns: ['id', 'skuId', 'onHand', 'reserved', 'available', 'createdAt', 'updatedAt'],
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.object(DtoStockSkuRef))
  sku?: DtoStockSkuRef;
}
