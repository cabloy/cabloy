import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { context } from '@opentelemetry/api';
import { BeanBase, captureRequestBoundary, getRequestBoundary, uuidv4 } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { createHttpSpanEnd, recordSpanException } from '../lib/spanDiagnostics.ts';

export interface IMiddlewareSystemOptionsTrace extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsTrace>({
  dependents: 'a-logger:httpLog',
})
export class MiddlewareSystemTrace extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsTrace, next: Next) {
    if (getRequestBoundary()) return next();
    const telemetry = this.$scope.telemetry.service.telemetry;
    if (!telemetry.enabled || this.ctx.state.telemetry?.internalAction) return next();

    const ctx = this.ctx;
    const config = telemetry.scope.config;
    const requestIdHeader = config.requestIdHeader;
    const requestId = normalizeRequestId(ctx.get(requestIdHeader)) ?? uuidv4();
    const trustedIngress = telemetry.isTrustedIngress(
      ctx.req.socket.remoteAddress,
      ctx.get(config.ingress.internalHeader),
    );
    const parent = telemetry.extractHttpIngressCarrier(trustedIngress, {
      version: 1,
      traceparent: ctx.get('traceparent') || undefined,
      tracestate: ctx.get('tracestate') || undefined,
    });
    const span = telemetry.createServerSpan(ctx.method, parent);
    const active = telemetry.createContext(span, parent);
    ctx.state.telemetry = { requestId, context: active, serverSpan: span };
    ctx.set(requestIdHeader, requestId);

    const capture = captureRequestBoundary();
    const terminal = createHttpSpanEnd(span, ctx.res, capture);
    ctx.res.once('finish', terminal.finish);
    ctx.res.once('close', terminal.close);

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
      recordSpanException(span, err, capture);
      throw err;
    }
  }
}

function normalizeRequestId(value?: string) {
  if (!value || value.length > 128 || !/^[\w.-]+$/.test(value)) return;
  return value;
}
