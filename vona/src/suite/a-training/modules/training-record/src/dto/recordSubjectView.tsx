import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoRecordSubjectBase } from './recordSubjectBase.tsx';

export interface IDtoOptionsRecordSubjectView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSubjectView>({
  blocks: [ZovaRender.block('basic-details:blockForm')],
})
export class DtoRecordSubjectView extends $Dto.get(() => ModelSubject, {
  dtoClass: DtoRecordSubjectBase,
}) {}
