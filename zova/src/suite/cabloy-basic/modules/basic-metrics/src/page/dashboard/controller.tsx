import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import { ModelMetrics } from '../../model/metrics.js';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  @Use()
  $$modelMetrics: ModelMetrics;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.querySnapshot);
  }

  get querySnapshot() {
    return this.$$modelMetrics.snapshot();
  }

  protected render() {
    const snapshot = this.querySnapshot.data!;
    const runtime = snapshot.runtime;
    return (
      <main class="p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h1 class="text-2xl font-semibold">Metrics</h1>
          <button class="btn btn-sm" onClick={() => this.querySnapshot.refetch()}>
            Refresh
          </button>
        </div>
        {!snapshot.enabled ? (
          <div class="alert mt-6">Metrics collection is disabled.</div>
        ) : (
          <>
            <section class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Runtime" value={runtime.state} />
              <MetricCard label="RSS" value={formatBytes(runtime.rssBytes)} />
              <MetricCard label="Heap used" value={formatBytes(runtime.heapUsedBytes)} />
              <MetricCard
                label="Event loop max"
                value={formatSeconds(runtime.eventLoopDelayMaxSeconds)}
              />
            </section>
            <section class="mt-6 overflow-x-auto">
              <h2 class="text-lg font-medium">Queues</h2>
              <table class="table mt-2">
                <thead>
                  <tr>
                    <th>Queue</th>
                    <th>State</th>
                    <th>Observed</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.queues.length ? (
                    snapshot.queues.map(queue => (
                      <tr key={queue.name}>
                        <td>{queue.name}</td>
                        <td>{queue.state}</td>
                        <td>{queue.observedAt || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan={3}>No queue metrics are available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    );
  }
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div class="rounded-box bg-base-200 p-4">
      <div class="text-sm opacity-70">{label}</div>
      <div class="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function formatBytes(value?: number) {
  if (value === undefined) return '—';
  return `${(value / 1024 / 1024).toFixed(1)} MiB`;
}

function formatSeconds(value?: number) {
  if (value === undefined) return '—';
  return `${(value * 1000).toFixed(1)} ms`;
}
