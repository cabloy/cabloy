import type { TableIdentity } from 'table-identity';
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
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoPaymentSessionView> {
    const session = await this.scope.model.paymentSession.getById(id);
    if (!session || String(session.userId) !== String(this.bean.passport.currentUser!.id)) {
      this.app.throw(404, 'payment session not found');
    }
    const started = await this.scope.service.paymentSession.start(session.id);
    return {
      id: started.id,
      state: started.state,
      providerName: started.providerName,
      nextAction: started.nextAction,
      amountMinor: started.amountMinor,
      currency: started.currency,
    };
  }

  @Web.get(':id')
  @Api.body(DtoPaymentSessionView)
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoPaymentSessionView> {
    const session = await this.scope.model.paymentSession.getById(id);
    if (!session || String(session.userId) !== String(this.bean.passport.currentUser!.id)) {
      this.app.throw(404, 'payment session not found');
    }
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
