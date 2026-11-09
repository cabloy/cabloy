import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Class } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

import { ModelOrder } from '../model/order.ts';

export const orderQueryPage = $defineQuery(() => ModelOrder, {
  name: 'TestOrderQueryPage',
  fields: {
    orderNo: { operators: ['eq', 'containsI'] },
    remark: { operators: ['eq', 'containsI'] },
  },
  orderable: ['id', 'orderNo', 'remark', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }], pageSize: 30 },
  limits: { maxPageSize: 300 },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsOrderQueryPage extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderQueryPage>({
  query: orderQueryPage,
  fields: {
    pageSize: z.number().min(1).max(300).default(30),
  },
})
export class DtoOrderQueryPage extends $Class.omit(
  $Dto.queryPage(orderQueryPage, ['orderNo', 'remark']),
  ['pageSize'],
) {
  @Api.field(z.number().min(1).max(300).default(30))
  pageSize: number;
}
