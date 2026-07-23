import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoOrderDetail } from '../dto/orderDetail.tsx';
import { DtoOrderSummary } from '../dto/orderSummary.tsx';

export interface IControllerOptionsOrder extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsOrder>('order')
export class ControllerOrder extends BeanBase {
  @Web.get('mine')
  @Api.body(v.array(DtoOrderSummary))
  async mine(): Promise<DtoOrderSummary[]> {
    return await this.scope.service.order.mine();
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoOrderDetail))
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoOrderDetail | undefined> {
    return await this.scope.service.order.view(id);
  }
}
