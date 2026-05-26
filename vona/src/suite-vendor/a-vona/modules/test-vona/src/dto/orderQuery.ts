import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { EntityOrder } from '../entity/order.ts';

export interface IDtoOptionsOrderQuery extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderQuery>({
  openapi: { filter: { table: 'testVonaOrder' } },
})
export class DtoOrderQuery extends $Dto.query(EntityOrder, ['orderNo', 'remark']) {
  @Api.field(
    v.filter({
      table: 'testVonaUser',
      joinType: 'innerJoin',
      joinOn: ['userId', 'testVonaUser.id'],
      originalName: 'name',
    }),
    v.optional(),
  )
  userName?: string;
}
