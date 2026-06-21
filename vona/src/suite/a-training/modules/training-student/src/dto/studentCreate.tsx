import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
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
})
export class DtoStudentCreate extends $Dto.create(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordMutate } },
}) {
  @Api.field(
    v.title($locale('TrainingRecords')),
    ZovaRender.order(5),
    ZovaRender.field('basic-detail:formFieldDetails'),
    v.array(DtoDetailRecordResItem),
  )
  trainingRecords: DtoDetailRecordResItem[];
}
