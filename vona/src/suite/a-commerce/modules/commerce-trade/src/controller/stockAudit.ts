import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { $compileQuery } from 'vona-module-a-orm';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { stockAuditQuery, DtoStockAuditSelectReq } from '../dto/stockAuditSelectReq.tsx';
import { DtoStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import { DtoStockAuditView } from '../dto/stockAuditView.tsx';

export interface IControllerOptionsStockAudit extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStockAudit>('stockAudit')
@Resource()
export class ControllerStockAudit extends BeanBase {
  @Web.get()
  @Api.body(DtoStockAuditSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoStockAuditSelectReq) params: TypeQueryInput<typeof stockAuditQuery>,
  ): Promise<DtoStockAuditSelectRes> {
    return await this.scope.service.stockAudit.select(
      $compileQuery(this.scope.model.stockAudit, stockAuditQuery, params),
    );
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoStockAuditView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoStockAuditView | undefined> {
    return await this.scope.service.stockAudit.view(id);
  }
}
