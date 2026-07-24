import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsPassportTest extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassportTest>({
  path: 'passportTest',
  meta: { mode: ['dev', 'test'] },
})
@Api.exclude()
export class ControllerPassportTest extends BeanBase {
  @Web.post('activateCurrent')
  @Passport.activated(false)
  async activateCurrent() {
    await this.bean.user.activate(this.bean.passport.currentUser!);
  }
}
