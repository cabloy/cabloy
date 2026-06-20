import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoStudentSelectResItem } from './studentSelectResItem.tsx';

export interface IDtoOptionsStudentSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectRes>()
export class DtoStudentSelectRes extends $Dto.listAndCount(DtoStudentSelectResItem) {}
