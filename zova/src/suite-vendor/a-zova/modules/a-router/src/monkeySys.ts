import type { IModule } from '@cabloy/module-info';
import type { IMonkeyModuleSys, IMonkeySysApplicationInitialize, ZovaApplication } from 'zova';
import type { ErrorSSR } from 'zova-module-a-ssr';

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
      this._sysRouter = (await this.sys.bean._getBean('a-router.sys.router', false)) as SysRouter;
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
    app.$getPagePath = (pagePath, options) => {
      const query = { ...options?.query };
      // returnTo
      if (options?.returnTo) {
        const returnTo =
          typeof options.returnTo === 'string' ? options.returnTo : app.$getCurrentPagePath();
        if (returnTo !== app.$getPagePathHome()) {
          query[app.sys.env.ROUTER_KEY_RETURNTO] = returnTo;
        }
      }
      return app.meta.$router.getPagePath(
        pagePath as never,
        {
          params: options?.params,
          query,
        } as never,
      );
    };
    app.$getPagePathLogin = (returnTo?: string, cause?: string) => {
      const query: any = {};
      if (cause) {
        query.cause = cause;
      }
      const returnTo2 = returnTo === app.sys.env.ROUTER_PAGE_LOGIN ? undefined : returnTo;
      return app.$getPagePath(
        app.sys.env.ROUTER_PAGE_LOGIN as never,
        {
          query,
          returnTo: returnTo2,
        } as never,
      );
    };
    app.$getPagePathAccessDenied = () => {
      return app.$getPagePath('/home/base/errorAccessDenied' as never);
    };
    app.$gotoPage = (pagePath: string, options?: IGotoPageOptions): TypeGotoPageResult => {
      pagePath = app.$getPagePath(pagePath as never, options as never);
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
    app.$gotoHome = (options?: IGotoPageOptions) => {
      const pagePath = app.$getPagePathHome(options);
      return app.$gotoPage(pagePath, { ...options, params: undefined });
    };
    app.$gotoLogin = (returnTo?: string, cause?: string) => {
      if (
        !returnTo &&
        cast(app.meta.$router.currentRoute)?.path === app.sys.env.ROUTER_PAGE_LOGIN
      ) {
        return;
      }
      const returnTo2 = returnTo ?? app.$getCurrentPagePath();
      const pagePath = app.$getPagePathLogin(returnTo2, cause);
      return app.$gotoPage(pagePath);
    };
    app.$gotoAccessDenied = () => {
      const pagePath = app.$getPagePathAccessDenied();
      if (cast(app.meta.$router.currentRoute)?.path === pagePath) return;
      return app.$gotoPage(pagePath, { replace: true });
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
        app.$getPagePathHome();
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
    app.$getPagePathHome = (options?: IGotoPageOptions): string => {
      let params = options?.params;
      if (params?.locale === undefined) {
        params = Object.assign({}, params, { locale: true });
      }
      // not handle options?.query
      return app.meta.$router.getPagePath(
        app.sys.env.ROUTER_PAGE_HOME as never,
        { params } as never,
      );
    };
  }
}
