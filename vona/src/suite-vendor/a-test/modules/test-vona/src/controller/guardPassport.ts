import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsGuardPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsGuardPassport>('guardPassport')
export class ControllerGuardPassport extends BeanBase {
  @Web.get('testUserName')
  @Passport.userName({ name: 'admin' })
  testUserName() {}

  @Web.get('testUserNameFail')
  @Passport.userName({ name: 'admin-none' as any })
  testUserNameFail() {}

  @Web.get('testRoleName')
  @Passport.roleName({ name: 'admin' })
  testRoleName() {}

  @Web.get('testRoleNameFail')
  @Passport.roleName({ name: 'admin-none' as any })
  testRoleNameFail() {}
}
