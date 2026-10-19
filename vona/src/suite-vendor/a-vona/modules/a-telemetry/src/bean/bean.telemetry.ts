import type { Span, SpanOptions } from '@opentelemetry/api';

import { INVALID_SPAN_CONTEXT, trace } from '@opentelemetry/api';
import { BeanBase, getRequestBoundary } from 'vona';
import { Bean } from 'vona-module-a-bean';

const nonRecordingSpan = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);

@Bean()
export class BeanTelemetry extends BeanBase {
  get enabled() {
    if (getRequestBoundary()) return false;
    return this.scope.service.telemetry.enabled;
  }

  startSpan(name: string, options?: SpanOptions): Span {
    if (getRequestBoundary()) return nonRecordingSpan;
    const telemetry = this.scope.service.telemetry;
    return telemetry.enabled ? telemetry.startSpan(name, options) : nonRecordingSpan;
  }

  withSpan<RESULT>(span: Span, fn: () => RESULT): RESULT {
    if (getRequestBoundary()) return fn();
    const telemetry = this.scope.service.telemetry;
    return telemetry.enabled ? telemetry.withSpan(span, fn) : fn();
  }

  recordException(span: Span, error: unknown) {
    if (getRequestBoundary()) return;
    const telemetry = this.scope.service.telemetry;
    if (telemetry.enabled) telemetry.recordException(span, error);
  }

  withNamedSpan<RESULT>(name: string, fn: () => RESULT, options?: SpanOptions): RESULT {
    if (getRequestBoundary()) return fn();
    const span = this.startSpan(name, options);
    try {
      const result = this.withSpan(span, fn);
      if (isPromiseLike(result)) {
        return result.then(
          value => {
            this._endSpan(span);
            return value;
          },
          error => {
            this._recordAndEndSpan(span, error);
            throw error;
          },
        ) as RESULT;
      }
      this._endSpan(span);
      return result;
    } catch (error) {
      this._recordAndEndSpan(span, error);
      throw error;
    }
  }

  private _recordAndEndSpan(span: Span, error: unknown) {
    if (getRequestBoundary()) return;
    try {
      this.recordException(span, error);
    } catch {}
    this._endSpan(span);
  }

  private _endSpan(span: Span) {
    if (getRequestBoundary()) return;
    try {
      span.end();
    } catch {}
  }
}

function isPromiseLike<RESULT>(value: RESULT): value is RESULT & PromiseLike<Awaited<RESULT>> {
  if (!((typeof value === 'object' && value !== null) || typeof value === 'function')) return false;
  return typeof (value as { then?: unknown }).then === 'function';
}
