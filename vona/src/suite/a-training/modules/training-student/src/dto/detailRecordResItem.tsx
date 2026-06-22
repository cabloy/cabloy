import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoDetailRecordBase } from './detailRecordBase.tsx';

export interface IDtoOptionsDetailRecordResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordResItem>({
  blocks: [
    ZovaRender.block('basic-details:blockDetails', {
      blocks: [
        ZovaRender.block('basic-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('basic-details:actionCreate', {
              permission: { formScene: ['create', 'edit'] },
            }),
          ],
        }),
        ZovaRender.block('basic-details:blockTable'),
      ],
    }),
  ],
})
export class DtoDetailRecordResItem extends $Dto.get(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
}) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('basic-details:actionUpdate', {
          permission: { formScene: ['create', 'edit'] },
        }),
        ZovaRender.detailsActionRow('basic-details:actionDelete', {
          permission: { formScene: ['create', 'edit'] },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
