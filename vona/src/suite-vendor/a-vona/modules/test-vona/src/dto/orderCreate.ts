import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelOrder } from '../model/order.ts';

export interface IDtoOptionsOrderCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderCreate>()
export class DtoOrderCreate extends $Dto.create(() => ModelOrder, {
  columns: ['orderNo', 'remark'],
}) {}
