import type { Next, TypeAllErrorCodes } from 'vona';
import type {
  IDecoratorFilterOptionsGlobal,
  IFilterHtml,
  IFilterJson,
  IFilterLog,
} from 'vona-module-a-aspect';

import { BeanBase, cast, errorsInternal, Global } from 'vona';
import { Filter } from 'vona-module-a-aspect';

export type TypeFilterOptionsErrorLogs = {
  [K in TypeAllErrorCodes]?: boolean;
};

export interface IFilterOptionsError extends IDecoratorFilterOptionsGlobal {
  logs: TypeFilterOptionsErrorLogs;
}

@Filter<IFilterOptionsError>({ logs: {} })
@Global()
export class FilterError extends BeanBase implements IFilterLog, IFilterJson, IFilterHtml {
  async log(err: Error, options: IFilterOptionsError, next: Next): Promise<boolean> {
    // 403->401
    if (err.code === 403) {
      if (!this.bean.passport.isAuthenticated) {
        err.code = 401;
        err.status = 401;
      }
    }

    // message
    if (err.message && typeof err.message !== 'string') {
      if (this.app.meta.isProd) {
        err.message = JSON.stringify(err.message);
      } else {
        err.message = JSON.stringify(err.message, null, 2);
      }
    }

    // next
    if ((await next()) === true) return true;

    // log
    if (options.logs[err.code!] !== false) {
      this.$logger.error(err);
    }

    // handled
    return true;
  }

  async json(err: Error, _options: IFilterOptionsError, next: Next): Promise<boolean> {
    // next
    if ((await next()) === true) return true;

    const status = this.app.util.detectStatus(err);

    this.ctx.status = status;
    const code = err.code ?? err.status;
    const message = this.app.util.detectErrorMessage(err);

    // json error
    const errorJson = {
      code,
      message,
    } as any;
    if (cast(err).errors) {
      errorJson.errors = cast(err).errors;
    }

    if (status >= 500 && !this.app.meta.isProd) {
      // provide detail error stack in test/dev env
      errorJson.stack = err.stack;
      errorJson.name = err.name;
      for (const key in err) {
        if (!['status'].includes(key) && !errorJson[key]) {
          errorJson[key] = err[key];
        }
      }
    }

    this.ctx.body = errorJson;

    // handled
    return true;
  }

  async html(err: Error, _options: IFilterOptionsError, next: Next): Promise<boolean> {
    // next
    if ((await next()) === true) return true;

    const status = this.app.util.detectStatus(err);
    const errorPageUrl =
      typeof this.scope.config.error.errorPageUrl === 'function'
        ? this.scope.config.error.errorPageUrl(err, this.ctx)
        : this.scope.config.error.errorPageUrl;

    // keep the real response status
    this.ctx.realStatus = status;
    // don't respond any error message in production env
    if (this.app.meta.isProd) {
      // 5xx
      if (status >= 500) {
        if (errorPageUrl) {
          const statusQuery = `${errorPageUrl.indexOf('?') > 0 ? '&' : '?'}real_status=${status}`;
          this.ctx.redirect(errorPageUrl + statusQuery);
          return true;
        }
        this.ctx.status = 500;
        this.ctx.body = `<h2>Internal Server Error, real status: ${status}</h2>`;
        return true;
      }
      // 4xx
      this.ctx.status = status;
      this.ctx.body = `<h2>${status} ${errorsInternal[status]}</h2>`;
      return true;
    }
    // show simple error format for test
    if (this.app.meta.isTest) {
      this.ctx.status = status;
      this.ctx.body = `${err.name}: ${err.message}\n${err.stack}`;
      return true;
    }

    try {
      this.ctx.body = await this.bean.error.render(err, { returnHtml: true });
    } catch (err: any) {
      this.ctx.body = err.message;
    }

    // handled
    return true;
  }
}
