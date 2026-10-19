import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestBoundaryFailure =
  | 'observer_failed'
  | 'diagnostic_failed'
  | 'late_callback_failed';
export type VonaScopeOutcome = 'not_created' | 'disposed' | 'dispose_failed';
export type VonaScopeOutcomeObserver = (outcome: VonaScopeOutcome) => void;

declare const requestBoundaryBrand: unique symbol;

export interface RequestBoundary {
  readonly [requestBoundaryBrand]: true;
}

export interface RequestBoundaryCapture {
  readonly diagnostics: 'suppress';
  reportFailure(failure: RequestBoundaryFailure): void;
  snapshot(): Readonly<{ portFault: boolean }>;
}

const boundaries = new WeakMap<RequestBoundary, RequestBoundaryCapture>();
const boundaryStorage = new AsyncLocalStorage<RequestBoundary>();

export function createRequestBoundary(options?: {
  readonly onFailure?: (failure: RequestBoundaryFailure) => void;
}): RequestBoundary {
  const onFailure = options?.onFailure;
  const boundary = Object.freeze({}) as RequestBoundary;
  let portFault = false;
  let reporting = false;
  const reported = new Set<RequestBoundaryFailure>();
  const capture: RequestBoundaryCapture = Object.freeze({
    diagnostics: 'suppress',
    reportFailure(failure: RequestBoundaryFailure) {
      if (
        failure !== 'observer_failed' &&
        failure !== 'diagnostic_failed' &&
        failure !== 'late_callback_failed'
      ) {
        portFault = true;
        return;
      }
      portFault = true;
      if (reported.has(failure)) return;
      reported.add(failure);
      if (reporting || !onFailure) return;
      reporting = true;
      try {
        const result: unknown = onFailure(failure);
        if (result && (typeof result === 'object' || typeof result === 'function')) {
          const then = (result as PromiseLike<unknown>).then;
          if (typeof then === 'function') {
            portFault = true;
            void new Promise<unknown>((resolve, reject) => {
              then.call(result, resolve, reject);
            }).catch(() => {});
          }
        }
      } catch {
        portFault = true;
      } finally {
        reporting = false;
      }
    },
    snapshot() {
      return Object.freeze({ portFault });
    },
  });
  boundaries.set(boundary, capture);
  return boundary;
}

export function runWithRequestBoundary<T>(boundary: RequestBoundary, continuation: () => T): T {
  if (!boundaries.has(boundary)) throw new Error('Invalid request boundary');
  const current = boundaryStorage.getStore();
  if (current && current !== boundary) throw new Error('Request boundary cannot be replaced');
  if (current === boundary) return continuation();
  return boundaryStorage.run(boundary, continuation);
}

export function getRequestBoundary(): RequestBoundary | undefined {
  return boundaryStorage.getStore();
}

export function captureRequestBoundary(): RequestBoundaryCapture | undefined {
  const boundary = boundaryStorage.getStore();
  return boundary ? boundaries.get(boundary) : undefined;
}
