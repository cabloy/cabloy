import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoSkuSelectResItem } from './skuSelectResItem.tsx';

export interface IDtoOptionsSkuSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuSelectRes>()
export class DtoSkuSelectRes extends $Dto.listAndCount(DtoSkuSelectResItem) {}
