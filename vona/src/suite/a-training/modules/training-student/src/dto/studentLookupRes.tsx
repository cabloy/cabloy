import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoStudentLookupItem } from './studentLookupItem.tsx';

export interface IDtoOptionsStudentLookupRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentLookupRes>()
export class DtoStudentLookupRes extends $Dto.listAndCount(DtoStudentLookupItem) {}
