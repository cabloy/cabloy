import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';
import { DtoRecordSubjectMutate } from './recordSubjectMutate.tsx';
import { DtoRecordSubjectResItem } from './recordSubjectResItem.tsx';

export interface IDtoOptionsRecordUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordUpdate>({
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
      ZovaRender.order(5),
      ZovaRender.field('basic-details:formFieldDetails'),
      v.optional(),
    ),
  },
})
export class DtoRecordUpdate extends $Dto.update(() => ModelRecord, {
  include: { trainingRecordSubjects: { dtoClass: DtoRecordSubjectMutate } },
}) {
  @Api.field(
    v.title($locale('Student')),
    v.required(),
    ZovaRender.order(1),
    ZovaRender.field('basic-input:formFieldInput'),
  )
  declare studentId: TableIdentity;

  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoRecordSubjectResItem))
  _trainingRecordSubjects?: DtoRecordSubjectResItem[];
}
