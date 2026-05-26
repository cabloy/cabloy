import type { Next } from 'vona';
import type { IDecoratorMiddlewareOptionsGlobal, IMiddlewareExecute } from 'vona-module-a-aspect';

import { checkErrorJwtExpired } from '@cabloy/utils';
import { BeanBase, beanFullNameFromOnionName, Global } from 'vona';
import { Middleware } from 'vona-module-a-aspect';

export interface IMiddlewareOptionsSsrPassport extends IDecoratorMiddlewareOptionsGlobal {}

@Middleware<IMiddlewareOptionsSsrPassport>({ dependencies: 'a-core:gate' })
@Global()
export class MiddlewareSsrPassport extends BeanBase implements IMiddlewareExecute {
  async execute(_options: IMiddlewareOptionsSsrPassport, next: Next) {
    try {
      // next
      return await next();
    } catch (err: any) {
      if (await this._handleError(err)) return;
      throw err;
    }
  }

  async _handleError(err: Error): Promise<undefined | never> {
    if (err.code !== 401) return;
    if (this.ctx.acceptJSON) return;
    let onionOptions = this._getInterceptorOptions('a-ssr:ssrRedirect');
    if (!onionOptions) onionOptions = this._getInterceptorOptions('a-ssr:ssrRender');
    if (!onionOptions) return;
    // pagePath
    const pagePath = checkErrorJwtExpired(err) ? 'presetErrorExpired' : 'presetLogin';
    return await this.bean.ssr.redirect(onionOptions.site as any, pagePath, {
      query: { returnTo: this.app.util.getAbsoluteUrl(this.ctx.req.url as any) },
    });
  }

  _getInterceptorOptions(onionName: string): { site: string; pagePath: string } | undefined {
    const route = this.ctx.route?.route;
    const optionsRoute = route?.meta?.[beanFullNameFromOnionName(onionName, 'interceptor')];
    if (!optionsRoute) return;
    return this.bean.onion.interceptor.getOnionOptionsDynamic(onionName as any);
  }
}
