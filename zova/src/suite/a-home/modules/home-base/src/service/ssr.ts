import { checkErrorJwtExpired } from '@cabloy/utils';
import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

@Service()
export class ServiceSsr extends BeanBase {
  public async initialize() {
    // ssr hydrated
    if (process.env.CLIENT) {
      this.ctx.meta.$ssr.onHydrated(() => {
        // do something
      });
    }
    // ssr errorHandler
    if (process.env.SERVER) {
      this._ssrErrorHandler();
    }
  }

  private _ssrErrorHandler() {
    if (!process.env.SERVER) return;
    const _eventErrorHandler = this.app.meta.event.on('app:errorHandler', ({ err }, next) => {
      if (err.code === 401) {
        if (checkErrorJwtExpired(err)) {
          try {
            this.app.$gotoPage('/home/base/errorExpired', { returnTo: true });
          } catch (err: any) {
            this.ctx.meta.$ssr.renderSSRError = err;
          }
          return undefined;
        }
      }
      return next();
    });
    this.ctx.meta.$ssr.context.onRendered((_err?: Error) => {
      _eventErrorHandler();
    });
  }
}
