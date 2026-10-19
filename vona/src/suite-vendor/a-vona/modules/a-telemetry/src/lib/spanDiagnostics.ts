import type { Span } from '@opentelemetry/api';
import type { RequestBoundaryCapture } from 'vona';

import { SpanStatusCode } from '@opentelemetry/api';
import { captureRequestBoundary, getRequestBoundary } from 'vona';

export interface HttpSpanResponse {
  readonly statusCode: number;
  readonly writableEnded: boolean;
  removeListener: (event: 'finish' | 'close', listener: () => void) => unknown;
}

export function recordSpanException(
  span: Span,
  error: unknown,
  capture?: RequestBoundaryCapture,
): void {
  if (capture || getRequestBoundary()) return;
  if (error instanceof Error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    return;
  }
  span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
}

export function endHttpSpan(span: Span, statusCode: number, aborted = false): void {
  if (getRequestBoundary()) return;
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

export function createHttpSpanEnd(
  span: Span,
  response: HttpSpanResponse,
  capture?: RequestBoundaryCapture,
): Readonly<{ finish(): void; close(): void }> {
  capture ??= captureRequestBoundary();
  const reportFailure = () => capture?.reportFailure('late_callback_failed');
  let ended = false;
  const finish = () => end(false);
  const close = () => end(true);
  function end(closed: boolean) {
    if (ended) return;
    ended = true;
    try {
      response.removeListener(closed ? 'finish' : 'close', closed ? finish : close);
    } catch {
      reportFailure();
    }
    if (capture || getRequestBoundary()) return;
    try {
      endHttpSpan(
        span,
        response.statusCode || (closed ? 499 : 500),
        closed && !response.writableEnded,
      );
    } catch {
      reportFailure();
    }
  }
  return Object.freeze({ finish, close });
}
