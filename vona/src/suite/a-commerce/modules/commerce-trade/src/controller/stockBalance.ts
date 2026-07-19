import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelStockBalance } from '../model/stockBalance.ts';

import { DtoStockAdjust } from '../dto/stockAdjust.tsx';
import { DtoStockBalanceSelectReq } from '../dto/stockBalanceSelectReq.tsx';
import { DtoStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import { DtoStockBalanceView } from '../dto/stockBalanceView.tsx';
import { EntityStockBalance } from '../entity/stockBalance.tsx';

export interface IControllerOptionsStockBalance extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStockBalance>('stockBalance')
@Resource()
export class ControllerStockBalance extends BeanBase {
  @Web.post('adjustStock')
  @Api.body(v.object(EntityStockBalance))
  @Passport.systemAdmin()
  async adjustStock(
    @Arg.body(DtoStockAdjust) stockAdjust: DtoStockAdjust,
  ): Promise<EntityStockBalance> {
    return await this.scope.service.stockBalance.adjustStock(stockAdjust);
  }

  @Web.get()
  @Api.body(DtoStockBalanceSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoStockBalanceSelectReq) params: IQueryParams<ModelStockBalance>,
  ): Promise<DtoStockBalanceSelectRes> {
    return await this.scope.service.stockBalance.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoStockBalanceView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStockBalanceView | undefined> {
    return await this.scope.service.stockBalance.view(id);
  }
}
