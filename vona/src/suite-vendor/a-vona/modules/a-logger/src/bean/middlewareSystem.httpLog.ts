import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { AsyncLocalStorage } from 'node:async_hooks';
import { BeanBase, getRequestBoundary } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { redactHttpLogUrl } from '../lib/redactHttpLog.ts';

export interface IMiddlewareSystemOptionsHttpLog extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHttpLog>()
export class MiddlewareSystemHttpLog extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHttpLog, next: Next) {
    if (getRequestBoundary()) return next();
    const started = performance.now();
    const ctx = this.ctx;
    const res = ctx.res;
    const method = ctx.req.method;
    const url = redactHttpLogUrl(ctx.req.url);
    const logger = this.$loggerChild('res', 'access');
    // Preserve request correlation without creating another owned context scope.
    const publish = AsyncLocalStorage.bind(
      (record: {
        method: string | undefined;
        url: string | undefined;
        statusCode: number | null;
        durationMs: number;
        outcome: 'finished' | 'aborted';
      }) => {
        if (getRequestBoundary()) return;
        logger.http(() => JSON.stringify(record));
      },
    );
    let ended = false;
    const finish = () => end(false);
    const close = () => end(!res.writableFinished);
    function end(aborted: boolean) {
      if (ended) return;
      ended = true;
      const durationMs = performance.now() - started;
      res.removeListener('finish', finish);
      res.removeListener('close', close);
      if (getRequestBoundary() || ctx.state.staticFileServed === true) return;
      try {
        publish({
          method,
          url,
          statusCode: aborted && !res.headersSent ? null : res.statusCode,
          durationMs,
          outcome: aborted ? 'aborted' : 'finished',
        });
      } catch {
        // A late diagnostic failure must not change response or business behavior.
      }
    }
    res.once('finish', finish);
    res.once('close', close);
    if (res.writableFinished) finish();
    else if (res.destroyed) close();
    // Koa sends ordinary responses (including mapped errors) after middleware settles.
    return next();
  }
}
