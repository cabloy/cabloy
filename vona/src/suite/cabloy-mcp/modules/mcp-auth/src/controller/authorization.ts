import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoAuthorizationDecision } from '../dto/authorizationDecision.ts';
import { DtoAuthorizationRedirect } from '../dto/authorizationRedirect.ts';
import { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
import { getMcpAuthConfig, OAuthError } from '../lib/authorization.ts';

export interface IControllerOptionsAuthorization extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAuthorization>({ path: '//mcp/auth', tags: ['Authorization'] })
export class ControllerAuthorization extends BeanBase {
  @Web.get('summary')
  @Api.body(v.object(DtoAuthorizationSummary))
  async summary(@Arg.query('request') request: string): Promise<DtoAuthorizationSummary> {
    this.ctx.set('Cache-Control', 'no-store');
    this.ctx.set('Referrer-Policy', 'no-referrer');
    return await this.scope.service.authorization.summary(request);
  }

  @Web.post('decision')
  @Api.body(v.object(DtoAuthorizationRedirect))
  async decision(@Arg.body() data: DtoAuthorizationDecision): Promise<DtoAuthorizationRedirect> {
    this.ctx.set('Cache-Control', 'no-store');
    this.ctx.set('Referrer-Policy', 'no-referrer');
    const config = getMcpAuthConfig(this.app);
    const issuer = new URL(config.issuer);
    const origin = this.ctx.get('origin');
    // Use the existing exact-origin policy, never the permissive CORS predicate.
    if (!this.bean.security.checkOriginExact(origin, issuer.host)) {
      throw new OAuthError('access_denied', 403);
    }
    return await this.scope.service.authorization.decide(data.request, data.allow);
  }
}
