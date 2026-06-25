import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';
import { DtoRecordSubjectResItem } from './recordSubjectResItem.tsx';
import { DtoRecordSubjectView } from './recordSubjectView.tsx';

export interface IDtoOptionsRecordView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordView>({
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
  fields: {
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(5),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoRecordView extends $Dto.get(() => ModelRecord, {
  include: { trainingRecordSubjects: { dtoClass: DtoRecordSubjectView } },
}) {
  @Api.field(
    v.title($locale('Student')),
    ZovaRender.order(1),
    ZovaRender.field('basic-input:formFieldInput'),
  )
  declare studentId: TableIdentity;

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoRecordSubjectResItem))
  _trainingRecordSubjects?: DtoRecordSubjectResItem[];
}
