import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoOrderSummary } from './orderSummary.tsx';

export interface IDtoOptionsOrderMineRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderMineRes>()
export class DtoOrderMineRes extends $Dto.listAndCount(DtoOrderSummary) {}
