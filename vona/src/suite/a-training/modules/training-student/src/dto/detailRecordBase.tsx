import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { DtoFileView } from 'vona-module-a-file';
import { DtoImageView } from 'vona-module-a-image';
import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord, onEffectForTrainingRecordSubjects } from 'vona-module-training-record';
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
      ZovaRender.onEffect(onEffectForTrainingRecordSubjects),
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
    'sceneImageIds',
    'dossierFileIds',
    'description',
  ],
  include: { trainingRecordSubjects: true },
}) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-image:resolveViews', {
      fieldName: 'sceneImageIds',
      imageScene: 'training-record:sceneImage',
      deliveryOptions: { audience: true },
    }),
    v.array($Class.partial(DtoImageView)),
  )
  sceneImages?: Partial<DtoImageView>[];

  @Api.field(
    v.title($locale('DossierFiles')),
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-file:resolveViews', {
      fieldName: 'dossierFileIds',
      fileScene: 'training-record:dossierFile',
      deliveryOptions: { audience: true },
    }),
    v.array($Class.partial(DtoFileView)),
  )
  dossierFiles?: Partial<DtoFileView>[];
}
