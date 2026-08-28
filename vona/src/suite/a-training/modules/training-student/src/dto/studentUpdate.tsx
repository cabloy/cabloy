import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';
import { DtoDetailRecordMutate } from './detailRecordMutate.tsx';
import { DtoDetailRecordResItem } from './detailRecordResItem.tsx';

const studentContentField = $makeMetadata(
  ZovaRender.fieldSource('content.descriptionMarkdown'),
  ZovaRender.field('basic-markdown:formFieldMarkdown'),
);

export interface IDtoOptionsStudentUpdate extends IDecoratorDtoOptions<'content'> {}

@Dto<IDtoOptionsStudentUpdate>({
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
                                ],
                              },
                            ],
                          },
                          {
                            type: 'group',
                            title: $locale('StudentContent'),
                            children: [
                              {
                                type: 'section',
                                children: [{ type: 'field', name: 'content' }],
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
    content: studentContentField,
    trainingRecords: $makeMetadata(
      v.title($locale('TrainingRecords')),
      ZovaRender.order(6),
      ZovaRender.field('basic-details:formFieldDetails'),
    ),
  },
})
export class DtoStudentUpdate extends $Dto.update(() => ModelStudent, {
  columns: ['name', 'mobile', 'imageId', 'level'],
  include: {
    content: { columns: ['descriptionMarkdown'] },
    trainingRecords: { dtoClass: DtoDetailRecordMutate },
  },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordResItem))
  _trainingRecords?: DtoDetailRecordResItem[];
}
