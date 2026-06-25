import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoRecordSubjectBase } from './recordSubjectBase.tsx';

export interface IDtoOptionsRecordSubjectMutate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSubjectMutate>({
  blocks: [ZovaRender.block('basic-details:blockForm')],
})
export class DtoRecordSubjectMutate extends $Dto.mutate(() => ModelSubject, {
  dtoClass: DtoRecordSubjectBase,
}) {}
