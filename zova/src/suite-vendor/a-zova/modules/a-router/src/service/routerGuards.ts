import * as ModuleInfo from '@cabloy/module-info';
import { RouteLocationNormalizedLoadedGeneric } from '@cabloy/vue-router';
import { Service } from 'zova-module-a-bean';

import { BeanRouter } from '../bean/bean.router.js';
import { BeanRouterGuardsBase } from '../bean/bean.routerGuardsBase.js';
import { NavigationDirection, NavigationInformation, NavigationType } from '../types/router.js';

@Service()
export class ServiceRouterGuards extends BeanRouterGuardsBase {
  protected onRouterGuards(router: BeanRouter) {
    const self = this;
    router.beforeEach(async to => {
      // match path
      let match = to.matched.find(item => item.aliasOf);
      if (match) {
        match = match.aliasOf;
      } else {
        match = to.matched[to.matched.length - 1];
        // prepareCheck
        if (!(await this._prepareCheck(match?.path, to.path))) {
          // redirect again
          return to.fullPath;
        }
        // legacy
        const legacyRoute = router._findLegacyRoute(match?.name, match?.path);
        if (legacyRoute) return;
        // alias
        const configRoute = router._findConfigRoute(match?.name, match?.path);
        const alias = configRoute?.alias;
        if (alias) {
          // force load module
          const resLoadModule = await this._forceLoadModule(router, match?.name, match?.path);
          if (resLoadModule && resLoadModule !== true) return resLoadModule;
          if (resLoadModule === false) return to.fullPath;
          if (router.getRealRouteName(match?.name)) {
            const routeAlias = router.resolveName(
              `$alias:${match?.name as string}` as never,
              {
                params: to.params,
                query: to.query,
              } as any,
            );
            const fullPath = routeAlias.startsWith('/__alias__')
              ? routeAlias.substring('/__alias__'.length)
              : routeAlias;
            return fullPath || '/';
          } else {
            return {
              path: Array.isArray(alias) ? alias[0] : alias,
              params: to.params,
              query: to.query,
            };
          }
        }
      }
      // force load module
      const resLoadModule = await this._forceLoadModule(router, match?.name, match?.path);
      if (resLoadModule === true) return;
      if (resLoadModule) return resLoadModule;
      // redirect again
      return to.fullPath;
    });
    router.afterEach(function (to, from, error) {
      if (error) return;
      const info: NavigationInformation | undefined = arguments[3];
      // from
      if (from.fullPath !== to.fullPath) {
        self._afterEachFrom(router, from, info);
      }
      // to
      router.afterEachForwardRoute(to);
    });
  }

  private _afterEachFrom(
    router: BeanRouter,
    from: RouteLocationNormalizedLoadedGeneric,
    info: NavigationInformation | undefined,
  ) {
    if (!info) return;
    const needBack =
      (info.type === NavigationType.pop && info.direction === NavigationDirection.back) ||
      (info.type === NavigationType.push && info.replace);
    if (!needBack) return;
    router.afterEachBackRoute(from);
  }

  // if 404 then check if module loaded
  private async _prepareCheck(pathMatched: string | undefined, pathTo: string): Promise<boolean> {
    if (pathMatched === '/:catchAll(.*)*') {
      const moduleInfo = ModuleInfo.parseInfo(ModuleInfo.parseName(pathTo));
      if (
        moduleInfo &&
        this.app.meta.module.exists(moduleInfo.relativeName) &&
        !this.app.meta.module.get(moduleInfo.relativeName, false)
      ) {
        // use module
        await this.app.meta.module.use(moduleInfo.relativeName);
        // redirect again
        return false;
      }
    }
    return true;
  }

  private async _forceLoadModule(
    router: BeanRouter,
    name: string | symbol | null | undefined,
    path: string | undefined,
  ): Promise<string | boolean | undefined> {
    const nameOrPath = router.getRealRouteName(name) || path;
    // module info
    const moduleInfo = ModuleInfo.parseInfo(ModuleInfo.parseName(nameOrPath));
    if (!moduleInfo) {
      // donothing
      return true;
    }
    const moduleName = moduleInfo.relativeName;
    // check if exists
    if (!this.app.meta.module.exists(moduleName)) return '/404';
    // check if loaded
    const module = this.app.meta.module.get(moduleName, false);
    if (module) return true;
    // use module
    await this.app.meta.module.use(moduleName);
    // means need load
    return false;
  }
}
