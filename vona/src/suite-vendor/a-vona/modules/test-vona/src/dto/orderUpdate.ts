import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelOrder } from '../model/order.ts';

export interface IDtoOptionsOrderUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderUpdate>()
export class DtoOrderUpdate extends $Dto.update(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
}) {}
