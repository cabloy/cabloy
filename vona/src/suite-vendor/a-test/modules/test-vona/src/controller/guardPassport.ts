import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Resource } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsGuardPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsGuardPassport>('guardPassport')
@Resource()
export class ControllerGuardPassport extends BeanBase {
  @Web.get('testRoleName')
  @Passport.roleName({ name: 'admin' })
  testRoleName() {}

  @Web.get('testRoleNameFail')
  @Passport.roleName({ name: 'admin-none' as any })
  testRoleNameFail() {}

  @Web.get('testRoleNameControllerShouldNotExecute')
  @Passport.roleName({ name: 'admin' })
  testRoleNameControllerShouldNotExecute() {
    throw new Error('controller should not execute while retrieving default permissions');
  }

  @Web.get('testPublic')
  @Passport.public()
  testPublic() {}

  @Web.get('testActivatedFalse')
  @Passport.activated(false)
  testActivatedFalse() {}
}
