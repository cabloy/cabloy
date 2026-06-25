import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoDetailRecordSubjectBase } from './detailRecordSubjectBase.tsx';

export interface IDtoOptionsDetailRecordSubjectView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordSubjectView>({
  blocks: [ZovaRender.block('basic-details:blockForm')],
})
export class DtoDetailRecordSubjectView extends $Dto.get(() => ModelSubject, {
  dtoClass: DtoDetailRecordSubjectBase,
}) {}
