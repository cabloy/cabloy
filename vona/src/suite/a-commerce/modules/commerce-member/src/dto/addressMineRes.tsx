import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoAddressMineItem } from './addressMineItem.tsx';

export interface IDtoOptionsAddressMineRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressMineRes>()
export class DtoAddressMineRes extends $Dto.listAndCount(DtoAddressMineItem) {}
