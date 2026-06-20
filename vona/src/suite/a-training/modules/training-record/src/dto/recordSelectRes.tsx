import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoRecordSelectResItem } from './recordSelectResItem.tsx';

export interface IDtoOptionsRecordSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSelectRes>()
export class DtoRecordSelectRes extends $Dto.listAndCount(DtoRecordSelectResItem) {}
