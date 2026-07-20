import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoAddressSelectResItem } from './addressSelectResItem.tsx';

export interface IDtoOptionsAddressSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsAddressSelectRes>()
export class DtoAddressSelectRes extends $Dto.listAndCount(DtoAddressSelectResItem) {}
