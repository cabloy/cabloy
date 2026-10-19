import { AsyncLocalStorage } from 'node:async_hooks';

import type { VonaContext } from '../../types/context/index.ts';
import type { VonaApplication } from './application.ts';
import type {
  RequestBoundaryCapture,
  VonaScopeOutcome,
  VonaScopeOutcomeObserver,
} from './requestBoundary.ts';

import { captureRequestBoundary } from './requestBoundary.ts';

export class VonaAsyncLocalStorage extends AsyncLocalStorage<VonaContext> {
  app: VonaApplication;
  private readonly observedRuns = new WeakMap<VonaContext, { settled: boolean }>();

  constructor(app: VonaApplication) {
    super();
    this.app = app;
  }

  async run<R>(store: VonaContext, callback: () => R): Promise<R>;
  async run<R, TArgs extends any[]>(
    store: VonaContext,
    callback: (...args: TArgs) => R,
    ...args: TArgs
  ): Promise<R> {
    if (store === this.app.currentContext) {
      return await callback(...args);
    }
    if (this.observedRuns.has(store)) throw new Error('Context scope already owned');
    return this._runOwned(store, () => callback(...args));
  }

  async runObserved<R>(
    store: VonaContext,
    callback: () => R,
    observer: VonaScopeOutcomeObserver,
  ): Promise<R> {
    if (store === this.app.currentContext || this.observedRuns.has(store)) {
      throw new Error('Context scope already owned');
    }
    const frame = { settled: false };
    this.observedRuns.set(store, frame);
    try {
      return await this._runOwned(store, callback, observer);
    } finally {
      frame.settled = true;
    }
  }

  private _runOwned<R>(
    store: VonaContext,
    callback: () => R,
    observer?: VonaScopeOutcomeObserver,
  ): Promise<R> {
    const capture = captureRequestBoundary();
    return super.run(store, async () => {
      try {
        this.app.meta.ctxCounter.increment();
        return await callback();
      } finally {
        await this._disposeOwned(store, observer, capture);
      }
    });
  }

  private async _disposeOwned(
    store: VonaContext,
    observer: VonaScopeOutcomeObserver | undefined,
    capture: RequestBoundaryCapture | undefined,
  ): Promise<void> {
    try {
      await store.bean.dispose();
    } catch (error) {
      this._notifyScopeOutcome(observer, 'dispose_failed', capture);
      throw error;
    }
    try {
      this.app.meta.ctxCounter.decrement();
    } catch (error) {
      capture?.reportFailure('diagnostic_failed');
      throw error;
    }
    this._notifyScopeOutcome(observer, 'disposed', capture);
  }

  private _notifyScopeOutcome(
    observer: VonaScopeOutcomeObserver | undefined,
    outcome: VonaScopeOutcome,
    capture: RequestBoundaryCapture | undefined,
  ): void {
    if (!observer) return;
    try {
      const result: unknown = observer(outcome);
      if (result && (typeof result === 'object' || typeof result === 'function')) {
        const then = (result as PromiseLike<unknown>).then;
        if (typeof then === 'function') {
          capture?.reportFailure('observer_failed');
          void new Promise<unknown>((resolve, reject) => {
            then.call(result, resolve, reject);
          }).catch(() => {});
        }
      }
    } catch {
      capture?.reportFailure('observer_failed');
    }
  }
}
