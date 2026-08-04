import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { orderSummaryColumns } from '../lib/order.ts';
import { ModelOrder } from '../model/order.ts';

export interface IDtoOptionsOrderSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderSummary>()
export class DtoOrderSummary extends $Dto.get(() => ModelOrder, {
  columns: orderSummaryColumns,
}) {}
