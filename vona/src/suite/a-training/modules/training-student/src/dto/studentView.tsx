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

const studentContentFormField = $makeMetadata(
  ZovaRender.fieldSource('studentContentForm.descriptionMarkdown'),
  ZovaRender.field('basic-markdown:formFieldMarkdown'),
);

export interface IDtoOptionsStudentView extends IDecoratorDtoOptions<'studentContentForm'> {}

@Dto<IDtoOptionsStudentView>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('basic-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'tabs',
                    children: [
                      {
                        type: 'tab',
                        title: $locale('BasicInformation'),
                        children: [
                          {
                            type: 'group',
                            title: $locale('StudentProfile'),
                            children: [
                              {
                                type: 'section',
                                columns: { default: 1, md: 2 },
                                children: [
                                  { type: 'field', name: 'name' },
                                  { type: 'field', name: 'mobile' },
                                  { type: 'field', name: 'imageId' },
                                  {
                                    type: 'field',
                                    name: 'studentContentForm',
                                    span: { default: 1, md: 2 },
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'tab',
                        title: $locale('TrainingRecords'),
                        children: [
                          { type: 'field', name: 'level' },
                          {
                            type: 'section',
                            children: [{ type: 'field', name: 'trainingRecords' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
  fields: {
    studentContentForm: studentContentFormField,
    trainingRecords: $makeMetadata(
      v.title($locale('TrainingRecords')),
      ZovaRender.order(6),
      ZovaRender.field('basic-details:formFieldDetails'),
    ),
  },
})
export class DtoStudentView extends $Dto.get(() => ModelStudent, {
  include: {
    studentContentForm: true,
    trainingRecords: { dtoClass: DtoDetailRecordView },
  },
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
