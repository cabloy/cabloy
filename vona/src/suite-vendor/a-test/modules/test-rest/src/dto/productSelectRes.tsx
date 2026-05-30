import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoProductSelectResItem } from './productSelectResItem.tsx';

export interface IDtoOptionsProductSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductSelectRes>()
export class DtoProductSelectRes extends $Dto.listAndCount(DtoProductSelectResItem) {}
