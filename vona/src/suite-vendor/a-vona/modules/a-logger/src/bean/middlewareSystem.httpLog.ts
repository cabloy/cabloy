import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import StdSerializers from 'pino-std-serializers';
import { BeanBase, getRequestBoundary } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { redactHttpLogHeaders, redactHttpLogUrl } from '../lib/redactHttpLog.ts';
import { redactIsolatedReadyHeader } from '../lib/redactIsolatedReadyHeader.ts';

export interface IMiddlewareSystemOptionsHttpLog extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHttpLog>()
export class MiddlewareSystemHttpLog extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHttpLog, next: Next) {
    if (getRequestBoundary()) return next();
    const ctx = this.ctx;
    // start
    const serialized = StdSerializers.req(ctx.req);
    // Do not retain serializer query/params/raw extensions or request bodies in logs.
    const req = {
      method: serialized.method,
      url: redactHttpLogUrl(serialized.url),
      headers: redactHttpLogHeaders(
        redactIsolatedReadyHeader(
          serialized.headers,
          ctx.path,
          this.app.meta.env.VONA_TEST_RUN_ID,
          ['x-vona-test-challenge', 'x-vona-test-stop-nonce', 'x-vona-test-stop-authorization'],
        ),
      ),
      remoteAddress: serialized.remoteAddress,
      remotePort: serialized.remotePort,
    };
    // Capture sanitized snapshots now; defer only JSON encoding, never access to live requests.
    const profiler = this.$loggerChild('res', 'access').startTimer();
    // Static files are classified downstream; retain the request snapshot until then.
    try {
      await next();
    } finally {
      if (ctx.state.staticFileServed !== true) {
        this.$loggerChild('req', 'access').info(() => JSON.stringify(req));
      }
    }
    if (ctx.state.staticFileServed === true) return;
    // end
    const headers = redactHttpLogHeaders(
      redactIsolatedReadyHeader(
        ctx.res.getHeaders(),
        ctx.path,
        this.app.meta.env.VONA_TEST_RUN_ID,
        ['x-vona-test-proof', 'x-vona-test-stop-proof'],
      ),
    );
    const res = {
      url: redactHttpLogUrl(ctx.req.url),
      statusCode: ctx.res.statusCode,
      headers,
    };
    profiler.done({ level: 'info', message: () => JSON.stringify(res) });
  }
}
