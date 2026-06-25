import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';

export interface IDtoOptionsRecordBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordBase>({
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
    trainingRecordSubjects: $makeMetadata(
      v.title($locale('TrainingRecordSubjects')),
      ZovaRender.order(4),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoRecordBase extends $Dto.get(() => ModelRecord, {
  columns: ['id', 'deleted', 'studentId', 'name', 'score', 'description'],
  include: { trainingRecordSubjects: true },
}) {}
