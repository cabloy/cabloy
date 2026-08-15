import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStockAudit } from '../model/stockAudit.ts';
import { DtoStockSkuRef } from './stockSkuRef.tsx';

export interface IDtoOptionsStockAuditView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockAuditView>({
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
export class DtoStockAuditView extends $Dto.get(() => ModelStockAudit, {
  columns: [
    'id',
    'stockBalanceId',
    'skuId',
    'stockReservationId',
    'actorId',
    'operation',
    'delta',
    'reason',
    'correlationId',
    'priorOnHand',
    'priorReserved',
    'priorAvailable',
    'onHand',
    'reserved',
    'available',
    'createdAt',
    'updatedAt',
  ],
}) {
  @Api.field(v.optional(), v.object(DtoStockSkuRef))
  sku?: DtoStockSkuRef;
}
