import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsDetailRecordBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordBase>({
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(8),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoDetailRecordBase extends $Dto.get(() => ModelRecord, {
  columns: [
    'id',
    'deleted',
    'name',
    'subjectCount',
    'totalScore',
    'averageScore',
    'trainingTime',
    'description',
  ],
  include: { trainingRecordSubjects: true },
}) {}
