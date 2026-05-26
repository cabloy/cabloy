import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import StdSerializers from 'pino-std-serializers';
import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsHttpLog extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHttpLog>()
export class MiddlewareSystemHttpLog extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHttpLog, next: Next) {
    const ctx = this.ctx;
    // start
    const req = StdSerializers.req(ctx.req);
    this.$loggerChild('req').http(() => JSON.stringify(req));
    const profiler = this.$loggerChild('res').startTimer();
    // next
    await next();
    // end
    const res = {
      url: ctx.req.url,
      statusCode: ctx.res.statusCode,
      headers: ctx.res.getHeaders(),
    };
    profiler.done({ level: 'http', message: JSON.stringify(res) });
  }
}
