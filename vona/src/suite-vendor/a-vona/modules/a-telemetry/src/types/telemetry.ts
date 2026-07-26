import type { Context, Span } from '@opentelemetry/api';

export interface ITelemetryCarrier {
  version: 1;
  traceparent?: string;
  tracestate?: string;
}

export interface ITelemetryContextState {
  requestId?: string;
  context?: Context;
  span?: Span;
  serverSpan?: Span;
  internalAction?: boolean;
  serverSpanEnded?: boolean;
}

declare module 'vona' {
  export interface ContextState {
    telemetry?: ITelemetryContextState;
  }
}
