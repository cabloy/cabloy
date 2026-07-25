import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsPerformAction extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPerformAction>({ path: 'performAction', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerPerformAction extends BeanBase {
  @Web.post('echo')
  @Passport.public()
  echo(@Arg.body('id') id: number) {
    const url = this.scope.util.combineApiPath('performAction/echo');
    return { id, url };
  }

  @Web.get('rateLimit')
  @Passport.public()
  @Core.rateLimit({ mode: 'enforce', limit: 2, windowMs: 60_000, name: 'test-rate-limit' })
  rateLimit() {
    return 'allowed';
  }

  @Web.get('rateLimitExempt')
  @Passport.public()
  @Core.rateLimit({ mode: 'disabled' })
  rateLimitExempt() {
    return 'exempt';
  }
}
