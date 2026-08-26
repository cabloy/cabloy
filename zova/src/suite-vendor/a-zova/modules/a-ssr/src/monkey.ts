import type { IModule } from '@cabloy/module-info';
import type {
  BeanBase,
  BeanContainer,
  IMonkeyAppContextInitialize,
  IMonkeyAppInitialize,
  IMonkeyBeanInit,
  IMonkeyModule,
  ZovaContext,
} from 'zova';

import { isNavigationFailure } from '@cabloy/vue-router';
import { BeanSimple, cast } from 'zova';

import type { SSRMetaOptions } from './types/ssr.js';

import { createSsrNavigationSync } from './lib/ssrNavigation.js';
import { useMeta } from './lib/useMeta.js';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppContextInitialize, IMonkeyAppInitialize, IMonkeyBeanInit, IMonkeyModule
{
  appContextInitialize(ctx: ZovaContext): void {
    ctx.meta.$ssr = ctx.app.ctx.meta.$ssr;
    if (process.env.SERVER) {
      ctx.meta.$ssr._registerServerContext(ctx);
    }
  }

  async appInitialize() {
    this.app.meta.event.on('a-router:routerGuards', async (router, next) => {
      if (process.env.CLIENT) {
        const navigationSync = createSsrNavigationSync({
          getLocale: () => this.app.meta.locale.current,
          setLocale: locale => {
            this.app.meta.locale.current = locale;
          },
          setProfile: route => {
            this.ctx.meta.$ssr._setProfile(
              route.meta.ssrProfile,
              route.meta.ssrProfileOptions,
              route.meta.locale,
            );
          },
          setRouteLocale: route => {
            this.ctx.meta.$ssr._setLocale(route);
          },
        });
        router.beforeEach(to => {
          navigationSync.beforeEach(to);
        });
        router.afterEach((to, from, failure) => {
          navigationSync.afterEach(to, from, failure);
        });
      }
      return await next();
    });
    if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      this.ctx.meta.$ssr.onHydrated(() => {
        document.documentElement.setAttribute('data-zova-hydrated', this.sys.env.SITE_ID);
      });
    }
    // ssr errorHandler
    if (process.env.SERVER) {
      this._ssrErrorHandler();
    }
  }

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    // ssrContext.modules
    if (process.env.SERVER && process.env.PROD) {
      if (!this.ctx.meta.$ssr.context.modules) this.ctx.meta.$ssr.context.modules = new Set();
      this.ctx.meta.$ssr.context.modules.add(`@@${module.info.relativeName}`);
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    // eslint-disable-next-line
    const self = this;
    // $ssr
    bean.defineProperty(beanInstance, '$ssr', {
      enumerable: false,
      configurable: true,
      get() {
        return self.app.ctx.meta.$ssr;
      },
    });
    // $useMeta
    bean.defineProperty(beanInstance, '$useMeta', {
      enumerable: false,
      configurable: true,
      get() {
        return function (this: BeanBase, options: SSRMetaOptions | (() => SSRMetaOptions)) {
          const ctx: ZovaContext = cast(this).ctx;
          ctx.util.instanceScope(() => {
            useMeta(ctx, options);
          });
        };
      },
    });
  }

  private _ssrErrorHandler() {
    if (!process.env.SERVER) return;
    const _eventErrorHandler = this.app.meta.event.on('app:errorHandler', (_data, next) => {
      const err = next();
      if (!err || !(err instanceof Error)) return err;
      return this._errorHandlerDefaultServer(err);
    });
    this.ctx.meta.$ssr.context.onRendered((_err?: Error) => {
      _eventErrorHandler();
    });
  }

  private _errorHandlerDefaultServer(err: Error) {
    if (!process.env.SERVER) return err;
    if (isNavigationFailure(err)) {
      if (!this.ctx.meta.$ssr.renderSSRError) {
        this.ctx.meta.$ssr.renderSSRError = err;
      }
      return undefined;
    } else if (err.code === 401) {
      try {
        this.app.$gotoLogin();
      } catch (err: any) {
        this.ctx.meta.$ssr.renderSSRError = err;
      }
    } else {
      this.ctx.meta.$ssr.renderSSRError = err;
    }
    return undefined;
  }
}
