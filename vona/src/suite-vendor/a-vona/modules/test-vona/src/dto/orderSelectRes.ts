import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoOrderSelectResItem } from './orderSelectResItem.ts';

export interface IDtoOptionsOrderSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSelectRes>()
export class DtoOrderSelectRes extends $Dto.listAndCount(DtoOrderSelectResItem) {}
