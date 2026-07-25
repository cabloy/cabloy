import type { Span } from '@opentelemetry/api';
import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { context } from '@opentelemetry/api';
import { BeanBase, uuidv4 } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsTrace extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsTrace>({
  dependents: 'a-logger:httpLog',
})
export class MiddlewareSystemTrace extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsTrace, next: Next) {
    const telemetry = this.$scope.telemetry.service.telemetry;
    if (!telemetry.enabled || this.ctx.state.telemetry?.internalAction) return next();

    const ctx = this.ctx;
    const requestIdHeader = telemetry.scope.config.requestIdHeader;
    const requestId = normalizeRequestId(ctx.get(requestIdHeader)) ?? uuidv4();
    const parent = telemetry.extractCarrier({
      version: 1,
      traceparent: ctx.get('traceparent') || undefined,
      tracestate: ctx.get('tracestate') || undefined,
    });
    const span = telemetry.createServerSpan(ctx.method, parent);
    const active = telemetry.createContext(span, parent);
    ctx.state.telemetry = { requestId, context: active, serverSpan: span };
    ctx.set(requestIdHeader, requestId);

    const finish = () => this._end(span, ctx.res.statusCode || ctx.status || 500, false);
    const close = () =>
      this._end(span, ctx.res.statusCode || ctx.status || 499, !ctx.res.writableEnded);
    ctx.res.once('finish', finish);
    ctx.res.once('close', close);

    try {
      const result = await context.with(active, next);
      if (ctx.route) {
        telemetry.enrichHttpSpan(
          ctx.route.routeMethod,
          ctx.route.routePathRaw,
          ctx.route.controllerBeanFullName,
          ctx.route.action,
        );
      }
      return result;
    } catch (err) {
      telemetry.recordException(span, err);
      throw err;
    }
  }

  private _end(span: Span, statusCode: number, aborted: boolean) {
    if (!span || this.ctx.state.telemetry?.serverSpanEnded) return;
    this.ctx.state.telemetry!.serverSpanEnded = true;
    this.$scope.telemetry.service.telemetry.endHttpSpan(span, statusCode, aborted);
  }
}

function normalizeRequestId(value?: string) {
  if (!value || value.length > 128 || !/^[\w.-]+$/i.test(value)) return;
  return value;
}
