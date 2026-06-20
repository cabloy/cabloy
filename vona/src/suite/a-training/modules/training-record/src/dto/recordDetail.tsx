import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelRecord } from '../model/record.ts';

export interface IDtoOptionsRecordDetail extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordDetail>()
export class DtoRecordDetail extends $Dto.get(() => ModelRecord, {
  columns: ['id', 'name', 'score', 'description'],
}) {}
