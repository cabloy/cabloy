import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoPostSelectResItem } from './postSelectResItem.tsx';

export interface IDtoOptionsPostSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostSelectRes>()
export class DtoPostSelectRes extends $Dto.listAndCount(DtoPostSelectResItem) {}
