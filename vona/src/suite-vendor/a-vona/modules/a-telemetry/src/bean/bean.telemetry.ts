import type { Span, SpanOptions } from '@opentelemetry/api';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanTelemetry extends BeanBase {
  get enabled() {
    return this.scope.service.telemetry.enabled;
  }

  startSpan(name: string, options?: SpanOptions) {
    return this.scope.service.telemetry.startSpan(name, options);
  }

  withSpan<RESULT>(span: Span, fn: () => RESULT): RESULT {
    return this.scope.service.telemetry.withSpan(span, fn);
  }

  recordException(span: Span, error: unknown) {
    this.scope.service.telemetry.recordException(span, error);
  }

  withNamedSpan<RESULT>(name: string, fn: () => RESULT, options?: SpanOptions): RESULT {
    const telemetry = this.scope.service.telemetry;
    if (!telemetry.enabled) return fn();

    const span = telemetry.startSpan(name, options);
    try {
      const result = telemetry.withSpan(span, fn);
      if (isPromiseLike(result)) {
        return result.then(
          value => {
            span.end();
            return value;
          },
          error => {
            telemetry.recordException(span, error);
            span.end();
            throw error;
          },
        ) as RESULT;
      }
      span.end();
      return result;
    } catch (error) {
      telemetry.recordException(span, error);
      span.end();
      throw error;
    }
  }
}

function isPromiseLike<RESULT>(value: RESULT): value is RESULT & PromiseLike<Awaited<RESULT>> {
  return (
    ((typeof value === 'object' && value !== null) || typeof value === 'function') &&
    'then' in value
  );
}
