import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoPaymentSessionView } from '../dto/paymentSessionView.tsx';

export interface IControllerOptionsPaymentSession extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPaymentSession>('payment-session')
export class ControllerPaymentSession extends BeanBase {
  @Web.post(':id/start')
  @Api.body(DtoPaymentSessionView)
  async start(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoPaymentSessionView> {
    const session = await this.scope.model.paymentSession.getById(id);
    if (!session || String(session.userId) !== String(user.id)) {
      this.app.throw(404, 'payment session not found');
    }
    const started = await this.scope.service.paymentSession.start(session.id);
    return this._toView(started);
  }

  @Web.post(':id/reconcile')
  @Api.body(DtoPaymentSessionView)
  async reconcile(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoPaymentSessionView> {
    const session = await this.scope.model.paymentSession.getById(id);
    if (!session || String(session.userId) !== String(user.id)) {
      this.app.throw(404, 'payment session not found');
    }
    const reconciled = await this.scope.service.providerOperation.reconcile(session.id);
    return this._toView(reconciled);
  }

  @Web.get(':id')
  @Api.body(DtoPaymentSessionView)
  async view(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoPaymentSessionView> {
    const session = await this.scope.model.paymentSession.getById(id);
    if (!session || String(session.userId) !== String(user.id)) {
      this.app.throw(404, 'payment session not found');
    }
    return this._toView(session);
  }

  private _toView(session: {
    id: TableIdentity;
    state: DtoPaymentSessionView['state'];
    providerName: string;
    nextAction?: DtoPaymentSessionView['nextAction'];
    amountMinor: number;
    currency: string;
  }): DtoPaymentSessionView {
    return {
      id: session.id,
      state: session.state,
      providerName: session.providerName,
      nextAction: session.nextAction,
      amountMinor: session.amountMinor,
      currency: session.currency,
    };
  }
}
