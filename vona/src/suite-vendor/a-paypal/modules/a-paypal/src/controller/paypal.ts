import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { EntityPaypalRecord } from '../entity/paypalRecord.tsx';

export interface IControllerOptionsPaypal extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPaypal>('paypal')
export class ControllerPaypal extends BeanBase {
  @Web.get('getRecord/:recordId')
  @Api.body(EntityPaypalRecord)
  async getRecord(
    @Arg.user() user: IUser,
    @Arg.param('recordId', v.tableIdentity()) recordId: TableIdentity,
  ): Promise<EntityPaypalRecord> {
    return await this.scope.service.paypal.getRecord(user.id, recordId);
  }

  @Web.post('captureOrder/:recordId')
  async captureOrder(
    @Arg.user() user: IUser,
    @Arg.param('recordId', v.tableIdentity()) recordId: TableIdentity,
  ): Promise<void> {
    return await this.scope.service.paypal.captureOrder(user.id, recordId);
  }

  @Web.post('cancelOrder/:recordId')
  async cancelOrder(
    @Arg.user() user: IUser,
    @Arg.param('recordId', v.tableIdentity()) recordId: TableIdentity,
  ): Promise<void> {
    return await this.scope.service.paypal.cancelOrder(user.id, recordId);
  }
}
