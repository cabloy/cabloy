import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Api } from 'vona-module-a-openapiutils';
import { Controller, Web } from 'vona-module-a-web';

import type { IAuthenticateStrategyState } from '../types/auth.ts';

export interface IControllerOptionsPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassport>('passport')
export class ControllerPassport extends BeanBase {
  @Web.get('callback')
  @Aspect.guardGlobal('a-user:passport', { public: true })
  @Api.exclude()
  async callback() {
    const code = this.ctx.query.code as string;
    const stateQuery = this.ctx.query.state as string;
    if (!stateQuery) this.app.throw(403);
    const strategyState: IAuthenticateStrategyState = (await this.bean.jwt
      .get('oauthstate')
      .verify(stateQuery)) as unknown as IAuthenticateStrategyState;
    return await this.bean.executor.newCtx(
      async () => {
        this.ctx.request.query = { code, state: stateQuery };
        return await this.scope.service.auth.authCallback(strategyState);
      },
      {
        locale: strategyState.locale,
        tz: strategyState.tz,
        instanceName: strategyState.instanceName,
        instance: true,
      },
    );
  }
}
