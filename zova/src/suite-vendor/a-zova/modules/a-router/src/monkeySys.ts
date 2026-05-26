import type { IModule } from '@cabloy/module-info';
import type { IMonkeyModuleSys, IMonkeySysApplicationInitialize, ZovaApplication } from 'zova';
import type { ErrorSSR } from 'zova-module-a-ssr';

import { combineQueries } from '@cabloy/utils';
import { BeanSimple, cast, isHttpUrl } from 'zova';

import type { SysRouter } from './bean/sys.router.js';
import type { TypeGotoPageResult } from './types/router.js';
import type { IGotoPageOptions } from './types/utils.js';

export class MonkeySys
  extends BeanSimple
  implements IMonkeyModuleSys, IMonkeySysApplicationInitialize
{
  private _moduleSelf: IModule;
  private _sysRouter: SysRouter;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  async getSysRouter() {
    if (!this._sysRouter) {
      this._sysRouter = (await this.bean._getBean('a-router.sys.router', false)) as SysRouter;
    }
    return this._sysRouter;
  }

  async moduleLoading(module: IModule) {
    if (this._moduleSelf === module) return;
    if (!module.resource.routes) return;
    const sysRouter = await this.getSysRouter();
    sysRouter._registerRoutes(module);
  }

  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config) {}

  sysApplicationInitialize(app: ZovaApplication): void {
    app.$redirect = (pagePath: string, status?: 301 | 302): never => {
      const error = new Error() as ErrorSSR;
      error.code = status ?? 302;
      if (isHttpUrl(pagePath)) {
        error.pagePath = pagePath;
        error.url = pagePath;
      } else {
        error.pagePath = pagePath;
        error.url = app.sys.util.getAbsoluteUrlFromPagePath(pagePath, true);
      }
      error.message = process.env.SERVER ? error.url : error.pagePath;
      throw error;
    };
    app.$gotoPage = (pagePath: string, options?: IGotoPageOptions): TypeGotoPageResult => {
      const query = options?.query ?? {};
      // returnTo
      if (options?.returnTo) {
        const returnTo =
          typeof options?.returnTo === 'string' ? options?.returnTo : app.$getCurrentPagePath();
        if (returnTo !== app.sys.env.ROUTER_PAGE_HOME) {
          query[app.sys.env.ROUTER_KEY_RETURNTO] = returnTo;
        }
      }
      // combineQueries
      pagePath = combineQueries(pagePath, query);
      // redirect
      if (process.env.SERVER || options?.forceRedirect) {
        return app.$redirect(pagePath);
      }
      // replace
      if (isHttpUrl(pagePath)) {
        window.location[options?.replace ? 'replace' : 'assign'](pagePath);
      } else {
        return app.meta.$router[options?.replace ? 'replace' : 'push'](pagePath);
      }
    };
    app.$gotoHome = () => {
      return app.$gotoPage(app.sys.env.ROUTER_PAGE_HOME);
    };
    app.$gotoLogin = (returnTo?: string, cause?: string) => {
      if (!returnTo && cast(app.meta.$router.currentRoute)?.path === app.sys.env.ROUTER_PAGE_LOGIN)
        return;
      const query: any = {};
      if (cause) {
        query.cause = cause;
      }
      const returnTo2 = returnTo === app.sys.env.ROUTER_PAGE_LOGIN ? undefined : (returnTo ?? true);
      return app.$gotoPage(app.sys.env.ROUTER_PAGE_LOGIN, { query, returnTo: returnTo2 });
    };
    app.$gotoReturnTo = (returnTo?: string) => {
      const pagePath = app.$getReturnTo(returnTo);
      return app.$gotoPage(pagePath, { replace: true });
    };
    app.$getReturnTo = (returnTo?: string) => {
      // not use ??
      const pagePath =
        returnTo ||
        cast(app.meta.$router.currentRoute)?.query?.[app.sys.env.ROUTER_KEY_RETURNTO] ||
        app.sys.env.ROUTER_PAGE_HOME;
      return pagePath;
    };
    app.$getCurrentPagePath = (): string | undefined => {
      if (process.env.SERVER) {
        return (
          app.ctx.meta.$ssr.state.pagePathFull ??
          app.sys.util.getPagePathFromAbsoluteUrl(app.ctx.meta.$ssr.context.req.url)
        );
      }
      return cast(app.meta.$router.currentRoute)?.fullPath;
    };
  }
}
