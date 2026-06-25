import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
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
              dialogOptions: { title: $locale('AddTrainingRecord') },
              permission: { formScene: ['create', 'edit'] },
            }),
          ],
        }),
        ZovaRender.block('basic-details:blockTable'),
      ],
    }),
  ],
  fields: {
    name: $makeMetadata(
      ZovaRender.cell('basic-details:actionView', {
        dialogOptions: { title: $locale('ViewTrainingRecord') },
      }),
    ),
  },
})
export class DtoDetailRecordResItem extends $Dto.get(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: false },
}) {
  @Api.field(v.title('#'), ZovaRender.order(1, 'core'), ZovaRender.cell('basic-details:lineNumber'))
  _lineNumber?: number;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('basic-details:actionUpdate', {
          dialogOptions: { title: $locale('EditTrainingRecord') },
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
