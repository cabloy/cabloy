import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelRecord } from '../model/record.ts';

export interface IDtoOptionsRecordDetailMutate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordDetailMutate>()
export class DtoRecordDetailMutate extends $Dto.update(() => ModelRecord, {
  columns: ['id', 'deleted', 'name', 'score', 'description'],
}) {}
