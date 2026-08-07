import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelSku } from '../model/sku.ts';

export interface IDtoOptionsSkuView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuView>({
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
export class DtoSkuView extends $Dto.get(() => ModelSku, {
  columns: [
    'id',
    'code',
    'productId',
    'priceCents',
    'lifecycle',
    'iid',
    'deleted',
    'createdAt',
    'updatedAt',
  ],
}) {}
