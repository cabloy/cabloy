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

import { useMeta } from './lib/useMeta.js';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppContextInitialize, IMonkeyAppInitialize, IMonkeyBeanInit, IMonkeyModule
{
  appContextInitialize(ctx: ZovaContext): void {
    ctx.meta.$ssr = ctx.app.ctx.meta.$ssr;
  }

  async appInitialize() {
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
