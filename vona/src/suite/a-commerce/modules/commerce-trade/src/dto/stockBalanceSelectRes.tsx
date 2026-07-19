import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { DtoStockBalanceSelectResItem } from './stockBalanceSelectResItem.tsx';

export interface IDtoOptionsStockBalanceSelectRes extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStockBalanceSelectRes>()
export class DtoStockBalanceSelectRes extends $Dto.listAndCount(DtoStockBalanceSelectResItem) {}
