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
    ZovaRender.block('basic-detail:blockDetails', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter'),
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
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
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('basic-table:actionUpdate'),
        ZovaRender.tableActionRow('basic-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
