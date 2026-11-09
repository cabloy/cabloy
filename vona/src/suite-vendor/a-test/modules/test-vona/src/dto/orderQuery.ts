import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { ModelOrder } from '../model/order.ts';
import { ModelUser } from '../model/user.ts';

export const orderQuery = $defineQuery(() => ModelOrder, {
  name: 'TestOrderQuery',
  pagination: false,
  fields: {
    orderNo: { operators: ['eq', 'containsI'] },
    remark: { operators: ['eq', 'containsI'] },
    userName: { operators: ['containsI'] },
  },
  orderable: ['id', 'orderNo', 'remark', 'createdAt', 'userName'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  bindings: {
    userName: {
      modelLike: () => ModelUser,
      field: 'name',
      localKey: 'userId',
      foreignKey: 'id',
      joinType: 'innerJoin',
    },
  },
  conveniences: { userName: { field: 'userName', op: 'containsI' } },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsOrderQuery extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderQuery>({
  query: orderQuery,
})
export class DtoOrderQuery extends $Dto.query(orderQuery, ['orderNo', 'remark']) {
  @Api.field(v.optional())
  userName?: string;
}
