import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import StdSerializers from 'pino-std-serializers';
import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { redactIsolatedReadyHeader } from '../lib/redactIsolatedReadyHeader.ts';

export interface IMiddlewareSystemOptionsHttpLog extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHttpLog>()
export class MiddlewareSystemHttpLog extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHttpLog, next: Next) {
    const ctx = this.ctx;
    // start
    const req = StdSerializers.req(ctx.req);
    req.headers = redactIsolatedReadyHeader(
      req.headers,
      ctx.path,
      this.app.meta.env.VONA_TEST_RUN_ID,
      ['x-vona-test-challenge', 'x-vona-test-stop-nonce', 'x-vona-test-stop-authorization'],
    );
    this.$loggerChild('req').http(() => JSON.stringify(req));
    const profiler = this.$loggerChild('res').startTimer();
    // next
    await next();
    // end
    const headers = redactIsolatedReadyHeader(
      ctx.res.getHeaders(),
      ctx.path,
      this.app.meta.env.VONA_TEST_RUN_ID,
      ['x-vona-test-proof', 'x-vona-test-stop-proof'],
    );
    const res = {
      url: ctx.req.url,
      statusCode: ctx.res.statusCode,
      headers,
    };
    profiler.done({ level: 'http', message: JSON.stringify(res) });
  }
}
