import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassport>('passport')
export class ControllerPassport extends BeanBase {
  @Web.get('isAuthenticated')
  isAuthenticated(): boolean {
    return this.bean.passport.isAuthenticated;
  }

  @Web.get('current')
  current() {
    return this.bean.passport.current;
  }
}
