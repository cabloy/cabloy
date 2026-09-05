import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { onEffectForTrainingRecordSubjects } from '../lib/onEffectForTrainingRecordSubjects.tsx';
import { ModelRecord } from '../model/record.ts';
import { DtoDetailRecordSubjectMutate } from './detailRecordSubjectMutate.tsx';
import { DtoDetailRecordSubjectResItem } from './detailRecordSubjectResItem.tsx';

export interface IDtoOptionsRecordCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordCreate>({
  openapi: { title: $locale('AddTrainingRecord') },
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(8),
      ZovaRender.field('basic-details:formFieldDetails'),
      ZovaRender.onEffect(onEffectForTrainingRecordSubjects),
      v.optional(),
    ),
  },
})
export class DtoRecordCreate extends $Dto.create(() => ModelRecord, {
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate } },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
