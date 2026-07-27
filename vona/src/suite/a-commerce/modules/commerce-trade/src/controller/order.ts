import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelOrder } from '../model/order.ts';

import { DtoOrderDetail } from '../dto/orderDetail.tsx';
import { DtoOrderMineReq } from '../dto/orderMineReq.tsx';
import { DtoOrderMineRes } from '../dto/orderMineRes.tsx';
import { DtoOrderSelectReq } from '../dto/orderSelectReq.tsx';
import { DtoOrderSelectRes } from '../dto/orderSelectRes.tsx';
import { DtoOrderShip } from '../dto/orderShip.tsx';
import { DtoOrderView } from '../dto/orderView.tsx';
import { DtoRefundOutcomeCreate } from '../dto/refundOutcomeCreate.tsx';
import { DtoRefundRequestCreate } from '../dto/refundRequestCreate.tsx';
import { DtoRefundResult } from '../dto/refundResult.tsx';
import { DtoRefundReview } from '../dto/refundReview.tsx';
import { DtoShipmentView } from '../dto/shipmentView.tsx';

export interface IControllerOptionsOrder extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsOrder>('order')
@Resource()
export class ControllerOrder extends BeanBase {
  @Web.get('mine')
  @Api.body(DtoOrderMineRes)
  async mine(
    @Arg.filter(DtoOrderMineReq) params: IQueryParams<ModelOrder>,
  ): Promise<DtoOrderMineRes> {
    return await this.scope.service.order.mine(params);
  }

  @Web.get('viewMine/:id')
  @Api.body(v.optional(), v.object(DtoOrderDetail))
  async viewMine(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoOrderDetail | undefined> {
    return await this.scope.service.order.viewMine(id);
  }

  @Web.post(':id/requestRefund')
  @Api.body(DtoRefundResult)
  async requestRefund(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoRefundRequestCreate,
  ): Promise<DtoRefundResult> {
    return await this.scope.service.order.requestRefund(id, command);
  }

  @Web.post(':id/approveRefund')
  @Api.body(DtoRefundResult)
  @Passport.systemAdmin()
  async approveRefund(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoRefundReview,
  ): Promise<DtoRefundResult> {
    return await this.scope.service.order.approveRefund(id, command);
  }

  @Web.post(':id/rejectRefund')
  @Api.body(DtoRefundResult)
  @Passport.systemAdmin()
  async rejectRefund(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoRefundReview,
  ): Promise<DtoRefundResult> {
    return await this.scope.service.order.rejectRefund(id, command);
  }

  @Web.post(':id/refundOutcome')
  @Api.body(DtoRefundResult)
  @Passport.systemAdmin()
  async refundOutcome(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoRefundOutcomeCreate,
  ): Promise<DtoRefundResult> {
    return await this.scope.service.order.applyRefundOutcome(id, command);
  }

  @Web.post(':id/ship')
  @Api.body(DtoShipmentView)
  @Passport.systemAdmin()
  async ship(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body(DtoOrderShip) command: DtoOrderShip,
  ): Promise<DtoShipmentView> {
    return await this.scope.service.order.ship(id, command);
  }

  @Web.get()
  @Api.body(DtoOrderSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoOrderSelectReq) params: IQueryParams<ModelOrder>,
  ): Promise<DtoOrderSelectRes> {
    return await this.scope.service.order.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoOrderView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoOrderView | undefined> {
    return await this.scope.service.order.view(id);
  }
}
