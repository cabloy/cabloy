import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';
import { DtoDetailRecordMutate } from './detailRecordMutate.tsx';
import { DtoDetailRecordResItem } from './detailRecordResItem.tsx';

export interface IDtoOptionsStudentCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentCreate>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm', {
          formLayout: ZovaRender.formLayout({
            children: [
              {
                type: 'tabs',
                id: 'student-tabs',
                children: [
                  {
                    type: 'tab',
                    id: 'basic',
                    title: $locale('BasicInformation'),
                    children: [
                      {
                        type: 'group',
                        id: 'student-profile',
                        title: $locale('StudentProfile'),
                        children: [
                          {
                            type: 'section',
                            id: 'student-core',
                            columns: { default: 1, md: 2 },
                            children: [
                              { type: 'field', name: 'name' },
                              { type: 'field', name: 'mobile' },
                              { type: 'field', name: 'imageId' },
                              { type: 'field', name: 'level' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tab',
                    id: 'training-records',
                    title: $locale('TrainingRecords'),
                    children: [
                      {
                        type: 'section',
                        id: 'training-records-section',
                        children: [{ type: 'field', name: 'trainingRecords' }],
                      },
                    ],
                  },
                ],
              },
            ],
          }),
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
    trainingRecords: $makeMetadata(
      v.title($locale('TrainingRecords')),
      ZovaRender.order(6),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoStudentCreate extends $Dto.create(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordMutate } },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordResItem))
  _trainingRecords?: DtoDetailRecordResItem[];
}
