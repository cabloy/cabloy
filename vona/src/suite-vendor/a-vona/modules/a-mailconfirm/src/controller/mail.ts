import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsMail extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMail>('mail')
export class ControllerMail extends BeanBase {
  @Web.get('emailConfirmCallback')
  @Passport.public()
  async emailConfirmCallback(@Arg.query('token') token: string) {
    // cache
    const data = await this.scope.cacheRedis.emailConfirm.get(token);
    if (data) {
      await this.scope.cacheRedis.emailConfirm.del(token);
    }
    // emit
    return await this.scope.event.emailConfirmCallback.emit(data);
  }

  @Web.get('passwordResetCallback')
  @Passport.public()
  async passwordResetCallback(@Arg.query('token') token: string) {
    // cache
    const data = await this.scope.cacheRedis.passwordReset.get(token);
    if (data) {
      await this.scope.cacheRedis.passwordReset.del(token);
    }
    // emit
    return await this.scope.event.passwordResetCallback.emit(data);
  }
}
