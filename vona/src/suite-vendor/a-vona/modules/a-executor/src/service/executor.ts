import type { IApiPathRecordMethodMap } from 'vona-module-a-web';

import { combineParamsAndQuery } from '@cabloy/utils';
import { BeanBase, cast, deepExtend } from 'vona';
import { Aspect } from 'vona-module-a-aspect';
import { Service } from 'vona-module-a-bean';

import type { IGeneralInfoOptions, IPerformActionOptions } from '../types/executor.ts';

import { SymbolRouterMiddleware } from '../types/executor.ts';

@Service()
export class ServiceExecutor extends BeanBase {
  @Aspect.aopMethod('a-logger:log', { level: 'debug' })
  async performActionInner<METHOD extends keyof IApiPathRecordMethodMap>(
    method: METHOD,
    url: string,
    options?: IPerformActionOptions,
  ): Promise<any> {
    // app
    const app = this.app;
    // new ctx
    return await this.bean.executor.newCtx(
      async () => {
        const ctx = this.ctx;
        // default status code
        ctx.res.statusCode = 404;
        ctx.req.method = method.toUpperCase();
        // url
        ctx.req.url = combineParamsAndQuery(url, {
          params: options?.params,
          query: options?.query,
        });
        // headers
        ctx.req.headers = Object.assign({}, ctx.req.headers, options?.headers);
        // json
        if (!ctx.req.headers.accept) {
          ctx.req.headers.accept = 'application/json';
        }
        // authToken
        if (options?.authToken) {
          ctx.req.headers.authorization = `Bearer ${options?.authToken}`;
        }
        // // query
        // if (options?.query !== undefined) {
        //   cast(ctx.req).query = cast(ctx.request).query = options?.query;
        // }
        // body
        cast(ctx.req).body = ctx.request.body = options?.body ?? {}; // body should set {} if undefined/null
        // onion
        ctx.onionsDynamic = options?.onions;
        // invoke middleware
        await app[SymbolRouterMiddleware](ctx);
        // check result
        if (ctx.status === 200) {
          if (!ctx.body || (ctx.body as any).code === undefined) {
            // not check code, e.g. text/xml
            return ctx.body;
          }
          if ((ctx.body as any).code === 0) {
            return (ctx.body as any).data;
          }
          throw app.util.createError(ctx.body);
        } else {
          if (ctx.body && typeof ctx.body === 'object') {
            throw app.util.createError(ctx.body);
          } else {
            throw app.util.createError({
              code: ctx.status,
              message: ctx.message,
            });
          }
        }
      },
      { innerAccess: options?.innerAccess, extraData: options?.extraData },
    );
  }

  prepareGeneralInfo(options?: IGeneralInfoOptions): IGeneralInfoOptions {
    const current = this.bean.database.current;
    const level = (options?.dbInfo?.level ?? current?.level ?? 0) + 1;
    const clientName = options?.dbInfo?.clientName ?? current?.clientName;
    const locale = options?.locale === undefined ? this.ctx?.locale : options.locale;
    const tz = options?.tz === undefined ? this.ctx?.tz : options.tz;
    const instanceName =
      options?.instanceName === undefined ? this.ctx?.instanceName : options.instanceName;
    options = Object.assign({}, options, {
      dbInfo: { level, clientName },
      locale,
      tz,
      instanceName,
    });
    if (this.ctx) {
      options = deepExtend({ extraData: { request: { headers: {} } } }, options)!;
      // extraData: headers
      const headers = options.extraData!.request!.headers!;
      for (const key in this.ctx.request.headers) {
        if (key.startsWith('x-vona-data-') && !headers[key]) {
          const value = this.ctx.request.headers[key];
          if (value) {
            headers[key] = value as string;
          }
        }
      }
    }
    return options;
  }
}

// for (const key of ['x-clientid', 'x-scene']) {
//   if (!headers[key]) {
//     const value =
//       key === 'x-clientid'
//         ? (<any>ctx.app.bean).util.getFrontClientId()
//         : (<any>ctx.app.bean).util.getFrontScene();
//     if (value) {
//       headers[key] = value;
//     }
//   }
// }
// for (const key of ['host', 'origin', 'referer', 'user-agent']) {
//   if (!headers[key]) {
//     const value = this.ctx.request.headers[key];
//     if (value) {
//       headers[key] = value;
//     }
//   }
// }
