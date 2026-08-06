import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsPaymentCallback extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPaymentCallback>('payment-callback')
export class ControllerPaymentCallback extends BeanBase {
  @Web.get('return')
  @Passport.public()
  async returned(@Arg.query('state') state: string) {
    await this._handle('return', state);
  }

  @Web.get('cancel')
  @Passport.public()
  async cancelled(@Arg.query('state') state: string) {
    await this._handle('cancel', state);
  }

  private async _handle(purpose: 'return' | 'cancel', token: string) {
    const callback = await this.scope.service.paymentCallback.consume(purpose, token);
    if (purpose === 'return') {
      await this.scope.service.providerOperation.confirm(callback.paymentSessionId);
    } else {
      await this.scope.service.providerOperation.reconcile(callback.paymentSessionId);
    }
    this.ctx.redirect(callback.continuationPath);
  }
}
