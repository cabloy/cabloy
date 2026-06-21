import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';

export interface IDtoOptionsDetailRecordBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordBase>()
export class DtoDetailRecordBase extends $Dto.get(() => ModelRecord, {
  columns: ['id', 'name', 'score', 'description'],
}) {}
