import { monitorEventLoopDelay } from 'node:perf_hooks';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IMetricsRuntimeSnapshot,
  IMetricsSnapshot,
  TypeMetricsSectionState,
} from '../types/metrics.ts';

@Service()
export class ServiceMetricsRuntime extends BeanBase {
  private _runtime: IMetricsRuntimeSnapshot = { state: 'disabled' };
  private _timer?: ReturnType<typeof setInterval>;
  private _eventLoopDelay = monitorEventLoopDelay({ resolution: 20 });

  async start() {
    if (!this.$scope.metrics.service.metrics.enabled || this._timer) return;
    this._eventLoopDelay.enable();
    this._observeRuntime();
    this._timer = setInterval(
      () => this._observeRuntime(),
      this.scope.config.runtime.intervalMillis,
    );
    this._timer.unref();
  }

  async stop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = undefined;
    this._eventLoopDelay.disable();
  }

  snapshot(): IMetricsSnapshot {
    if (!this.$scope.metrics.service.metrics.enabled) {
      return { enabled: false, runtime: { state: 'disabled' }, queues: [] };
    }
    return { enabled: true, runtime: this._runtime, queues: [] };
  }

  private _observeRuntime() {
    try {
      const memory = process.memoryUsage();
      const state: TypeMetricsSectionState = 'fresh';
      const runtime = {
        uptimeSeconds: process.uptime(),
        rssBytes: memory.rss,
        heapUsedBytes: memory.heapUsed,
        heapTotalBytes: memory.heapTotal,
        externalBytes: memory.external,
        eventLoopDelayMaxSeconds: this._eventLoopDelay.max / 1e9,
        activeContexts: this.app.meta.ctxCounter.current,
      };
      this._runtime = {
        state,
        observedAt: new Date().toISOString(),
        ...runtime,
      };
      this.$scope.metrics.service.metrics.recordRuntime(runtime);
      this._eventLoopDelay.reset();
    } catch {
      this._runtime = {
        ...this._runtime,
        state: this._runtime.observedAt ? 'stale' : 'unavailable',
      };
      this.$scope.metrics.service.metrics.recordFailure('runtime');
    }
  }
}
