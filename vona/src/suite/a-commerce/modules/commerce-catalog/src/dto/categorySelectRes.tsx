import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoCategorySelectResItem } from './categorySelectResItem.tsx';

export interface IDtoOptionsCategorySelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCategorySelectRes>()
export class DtoCategorySelectRes extends $Dto.listAndCount(DtoCategorySelectResItem) {}
