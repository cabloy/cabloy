import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { DtoRecordSubjectBase } from './recordSubjectBase.tsx';

export interface IDtoOptionsRecordSubjectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSubjectResItem>({
  blocks: [
    ZovaRender.block('basic-details:blockDetails', {
      blocks: [
        ZovaRender.block('basic-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('basic-details:actionCreate', {
              dialogOptions: { title: $locale('AddTrainingRecordSubject') },
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
        dialogOptions: { title: $locale('ViewTrainingRecordSubject') },
      }),
    ),
  },
})
export class DtoRecordSubjectResItem extends $Dto.get(() => ModelSubject, {
  dtoClass: DtoRecordSubjectBase,
}) {
  @Api.field(v.title('#'), ZovaRender.order(1, 'core'), ZovaRender.cell('basic-details:lineNumber'))
  _lineNumber?: number;

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-details:actionOperationsRow', {
      actions: [
        ZovaRender.detailsActionRow('basic-details:actionUpdate', {
          dialogOptions: { title: $locale('EditTrainingRecordSubject') },
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
