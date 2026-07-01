import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoImageView } from 'vona-module-a-image';
import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';
import { DtoDetailRecordSubjectResItem } from './detailRecordSubjectResItem.tsx';
import { DtoDetailRecordSubjectView } from './detailRecordSubjectView.tsx';

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
      ZovaRender.order(8),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoRecordView extends $Dto.get(() => ModelRecord, {
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectView } },
}) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerCustom(function (_value, data: DtoRecordView) {
      return this.bean.image.resolveViews(
        data.sceneImageIds,
        undefined,
        'training-record:sceneImage',
      );
    }),
    v.array(DtoImageView),
  )
  sceneImages?: DtoImageView[];

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
