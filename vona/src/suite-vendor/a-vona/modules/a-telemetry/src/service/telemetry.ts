import type { Context, Span, SpanOptions } from '@opentelemetry/api';

import { context, propagation, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ITelemetryCarrier } from '../types/telemetry.ts';

import { createIngressTrustChecker } from '../lib/ingress.ts';

const carrierGetter = {
  get(carrier: ITelemetryCarrier, key: string) {
    if (key === 'traceparent' || key === 'tracestate') return carrier[key];
    return undefined;
  },
  keys(carrier: ITelemetryCarrier) {
    return Object.keys(carrier);
  },
};

const carrierSetter = {
  set(carrier: ITelemetryCarrier, key: string, value: string) {
    if (key === 'traceparent' || key === 'tracestate') {
      carrier[key] = value;
    }
  },
};

@Service()
export class ServiceTelemetry extends BeanBase {
  private _provider?: NodeTracerProvider;
  private _contextManager?: AsyncLocalStorageContextManager;
  private _isTrustedIngress?: (peerAddress?: string, internalHeaderValue?: string) => boolean;
  private _enabled = false;

  get enabled() {
    return this._enabled;
  }

  init() {
    if (this._provider || this._enabled) return;
    const config = this.scope.config;
    this._isTrustedIngress = createIngressTrustChecker(config.ingress);
    if (!config.enabled) return;

    const exporter = new OTLPTraceExporter({
      url: config.exporter.url,
      headers: config.exporter.headers,
    });
    const processor = new BatchSpanProcessor(exporter, {
      maxQueueSize: config.exporter.maxQueueSize,
      scheduledDelayMillis: config.exporter.scheduledDelayMillis,
      exportTimeoutMillis: config.exporter.exportTimeoutMillis,
    });
    this._provider = new NodeTracerProvider({
      resource: resourceFromAttributes({
        'service.name': config.serviceName,
        'service.instance.id': `${process.pid}`,
        'deployment.environment.name': this.app.config.meta.mode,
      }),
      sampler: new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(normalizeSamplingRatio(config.sampling.rootRatio)),
      }),
      spanProcessors: [processor],
    });
    this._contextManager = new AsyncLocalStorageContextManager().enable();
    propagation.setGlobalPropagator(new W3CTraceContextPropagator());
    this._provider.register({ contextManager: this._contextManager });
    this._enabled = true;
  }

  async close(forceFlush: boolean) {
    if (!this._provider) return;
    const timeout = this.scope.config.shutdown.timeoutMillis;
    try {
      await withTimeout(
        forceFlush ? this._provider.forceFlush() : this._provider.shutdown(),
        timeout,
      );
    } catch (err) {
      this.$logger.warn({
        event: 'telemetry.shutdown_failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  get activeContext() {
    return this.ctx?.state.telemetry?.context ?? context.active();
  }

  extractCarrier(carrier?: ITelemetryCarrier) {
    if (!carrier) return context.active();
    return propagation.extract(context.active(), carrier, carrierGetter);
  }

  isTrustedIngress(peerAddress?: string, internalHeaderValue?: string) {
    this._isTrustedIngress ??= createIngressTrustChecker(this.scope.config.ingress);
    return this._isTrustedIngress(peerAddress, internalHeaderValue);
  }

  extractHttpIngressCarrier(trusted: boolean, carrier: ITelemetryCarrier) {
    return trusted ? this.extractCarrier(carrier) : this.extractCarrier();
  }

  injectCarrier(source = this.activeContext): ITelemetryCarrier {
    const carrier: ITelemetryCarrier = { version: 1 };
    propagation.inject(source, carrier, carrierSetter);
    return carrier;
  }

  startSpan(name: string, options?: SpanOptions, parent = this.activeContext) {
    return trace.getTracer('vona-module-a-telemetry').startSpan(name, options, parent);
  }

  withSpan<RESULT>(span: Span, fn: () => RESULT): RESULT {
    const active = trace.setSpan(this.activeContext, span);
    return context.with(active, fn);
  }

  createContext(span: Span, parent = this.activeContext) {
    return trace.setSpan(parent, span);
  }

  recordException(span: Span, error: unknown) {
    if (error instanceof Error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      return;
    }
    span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
  }

  endHttpSpan(span: Span, statusCode: number, aborted = false) {
    if (aborted || statusCode >= 500) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: aborted ? 'client aborted' : undefined,
      });
    }
    span.setAttribute('http.response.status_code', statusCode);
    if (aborted) span.setAttribute('vona.http.aborted', true);
    span.end();
  }

  getLogContext() {
    if (!this._enabled) return;
    const spanContext = trace.getSpanContext(this.activeContext);
    if (!spanContext || !trace.isSpanContextValid(spanContext)) return;
    return {
      request_id: this.ctx?.state.telemetry?.requestId,
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
      trace_flags: spanContext.traceFlags,
    };
  }

  createServerSpan(method: string, parent: Context) {
    return this.startSpan(`HTTP ${method}`, { kind: SpanKind.SERVER }, parent);
  }

  enrichHttpSpan(
    method: string,
    routePath: string,
    controllerBeanFullName: string,
    action: string,
  ) {
    const span = this.ctx.state.telemetry?.serverSpan;
    if (!span) return;
    span.updateName(`HTTP ${method.toUpperCase()} ${routePath}`);
    span.setAttributes({
      'http.route': routePath,
      'vona.controller': controllerBeanFullName,
      'vona.action': action,
    });
  }
}

function normalizeSamplingRatio(value: number) {
  if (!Number.isFinite(value)) return 0.1;
  return Math.max(0, Math.min(1, value));
}

async function withTimeout(promise: Promise<void>, timeoutMillis: number) {
  await Promise.race([
    promise,
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('telemetry shutdown timed out')), timeoutMillis).unref();
    }),
  ]);
}
