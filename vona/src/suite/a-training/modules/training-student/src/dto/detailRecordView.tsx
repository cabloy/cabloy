import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoDetailRecordBase } from './detailRecordBase.tsx';
import { DtoDetailRecordSubjectResItem } from './detailRecordSubjectResItem.tsx';
import { DtoDetailRecordSubjectView } from './detailRecordSubjectView.tsx';

export interface IDtoOptionsDetailRecordView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordView>({
  blocks: [ZovaRender.block('basic-details:blockForm')],
})
export class DtoDetailRecordView extends $Dto.get(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectView } },
}) {
  @Api.field(ZovaRender.visible(false), v.optional(), v.array(DtoDetailRecordSubjectResItem))
  _trainingRecordSubjects?: DtoDetailRecordSubjectResItem[];
}
