import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { EntityOrder } from '../entity/order.ts';

export interface IDtoOptionsOrderQueryPage extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderQueryPage>({
  fields: {
    pageSize: z.number().min(1).max(300).default(30),
  },
})
export class DtoOrderQueryPage extends $Class.omit(
  $Dto.queryPage(EntityOrder, ['orderNo', 'remark']),
  ['pageSize'],
) {
  @Api.field(z.number().min(1).max(300).default(30))
  pageSize: number;
}
