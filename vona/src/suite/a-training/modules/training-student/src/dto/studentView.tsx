import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoImageView } from 'vona-module-a-image';
import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';
import { DtoDetailRecordResItem } from './detailRecordResItem.tsx';
import { DtoDetailRecordView } from './detailRecordView.tsx';

export interface IDtoOptionsStudentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentView>({
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
    trainingRecords: $makeMetadata(
      v.title($locale('TrainingRecords')),
      ZovaRender.order(6),
      ZovaRender.field('basic-details:formFieldDetails'),
    ),
  },
})
export class DtoStudentView extends $Dto.get(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordView } },
}) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-image:resolveView', {
      fieldName: 'imageId',
      imageScene: 'training-student:studentImage',
    }),
    v.object(DtoImageView),
  )
  image?: DtoImageView;

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordResItem))
  _trainingRecords?: DtoDetailRecordResItem[];
}
