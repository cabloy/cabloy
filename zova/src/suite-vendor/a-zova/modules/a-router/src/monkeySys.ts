import type { IModule } from '@cabloy/module-info';
import type { IMonkeyModuleSys, IMonkeySysApplicationInitialize, ZovaApplication } from 'zova';
import type { ErrorSSR } from 'zova-module-a-ssr';

import { unref } from 'vue';
import { BeanSimple, cast, isHttpUrl } from 'zova';

import type { SysRouter } from './bean/sys.router.ts';
import type { TypeGotoPageResult } from './types/router.ts';
import type { IGotoPageOptions } from './types/utils.ts';

import { getLoginReturnTo, isLoginPage } from './lib/loginRedirect.ts';

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
    const isLogin = (pagePath: string | undefined) =>
      isLoginPage(pagePath, app.sys.env.ROUTER_PAGE_LOGIN, app.meta.$router?.router);
    const getReturnTo = (target: unknown) =>
      getLoginReturnTo(target, isLogin, {
        origin: process.env.CLIENT ? window.location.origin : undefined,
        publicPath: app.sys.env.APP_PUBLIC_PATH,
      });
    app.$isCurrentPageLogin = () => isLogin(app.$getCurrentPagePath());
    app.$getPagePathLogin = (returnTo?: string | boolean, cause?: string) => {
      const query: any = {};
      if (cause) {
        query.cause = cause;
      }
      const target =
        typeof returnTo === 'string' || returnTo === false ? returnTo : app.$getCurrentPagePath();
      return app.$getPagePath(
        app.sys.env.ROUTER_PAGE_LOGIN as never,
        {
          query,
          returnTo: getReturnTo(target),
        } as never,
      );
    };
    app.$getPagePathAccessDenied = () => {
      return app.$getPagePath('/home/base/errorAccessDenied' as never);
    };
    app.$gotoPage = (pagePath: string, options?: IGotoPageOptions): TypeGotoPageResult => {
      return _gotoPagePath(app, app.$getPagePath(pagePath as never, options as never), options);
    };
    app.$gotoHome = (options?: IGotoPageOptions) => {
      const pagePath = app.$getPagePathHome(options);
      return app.$gotoPage(pagePath, { ...options, params: undefined });
    };
    app.$gotoLogin = (returnTo?: string | boolean, cause?: string) => {
      if (app.$isCurrentPageLogin()) return;
      return _gotoPagePath(app, app.$getPagePathLogin(returnTo, cause));
    };
    app.$gotoAccessDenied = () => {
      const pagePath = app.$getPagePathAccessDenied();
      if (cast(app.meta.$router.currentRoute)?.path === pagePath) return;
      return app.$gotoPage(pagePath, { replace: true });
    };
    app.$gotoReturnTo = (returnTo?: string) => {
      return _gotoPagePath(app, app.$getReturnTo(returnTo), { replace: true });
    };
    app.$getReturnTo = (returnTo?: string) => {
      const route = unref(app.meta.$router?.router.currentRoute);
      const target = returnTo || route?.query[app.sys.env.ROUTER_KEY_RETURNTO];
      return getReturnTo(target) ?? app.$getPagePathHome();
    };
    app.$getCurrentPagePath = (): string | undefined => {
      if (process.env.SERVER) {
        return (
          app.ctx.meta.$ssr.state.pagePathFull ??
          app.sys.util.getPagePathFromAbsoluteUrl(app.ctx.meta.$ssr.context.req.url)
        );
      }
      return unref(app.meta.$router?.router.currentRoute)?.fullPath;
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

function _gotoPagePath(
  app: ZovaApplication,
  pagePath: string,
  options?: IGotoPageOptions,
): TypeGotoPageResult {
  if (process.env.SERVER || options?.forceRedirect) {
    return app.$redirect(pagePath);
  }
  if (isHttpUrl(pagePath)) {
    window.location[options?.replace ? 'replace' : 'assign'](pagePath);
  } else {
    return app.meta.$router[options?.replace ? 'replace' : 'push'](pagePath);
  }
}
