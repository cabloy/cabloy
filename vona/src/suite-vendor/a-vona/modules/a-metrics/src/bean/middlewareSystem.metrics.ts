import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsMetrics extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsMetrics>()
export class MiddlewareSystemMetrics extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsMetrics, next: Next) {
    const metrics = this.$scope.metrics.service.metrics;
    if (!metrics.enabled || this.ctx.state.metrics?.internal) return next();

    const startedAt = process.hrtime.bigint();
    const ctx = this.ctx;
    let completed = false;
    metrics.recordHttpStart();
    const record = (aborted: boolean) => {
      if (completed) return;
      completed = true;
      const route = ctx.route?.routePathRaw || 'unmatched';
      const ignore = route.startsWith('/health/') || route.includes('metricsAdmin');
      if (ignore) {
        metrics.recordHttpEnd();
        return;
      }
      metrics.recordHttpRequest({
        method: ctx.route?.routeMethod || ctx.method,
        route,
        statusCode: ctx.res.statusCode || ctx.status || (aborted ? 499 : 500),
        durationSeconds: Number(process.hrtime.bigint() - startedAt) / 1e9,
        aborted,
      });
    };
    ctx.res.once('finish', () => record(false));
    ctx.res.once('close', () => record(!ctx.res.writableEnded));
    ctx.state.metrics = { startedAt, completed: () => completed };

    return await next();
  }
}
