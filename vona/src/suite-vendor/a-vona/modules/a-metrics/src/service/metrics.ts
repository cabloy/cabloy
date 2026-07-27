import type { Counter, Gauge, Histogram, Meter, UpDownCounter } from '@opentelemetry/api';

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  AggregationType,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IMetricsHttpRequest } from '../types/metrics.ts';

import { METRICS_HTTP_DURATION_BUCKETS } from '../types/metrics.ts';

@Service()
export class ServiceMetrics extends BeanBase {
  private _provider?: MeterProvider;
  private _meter?: Meter;
  private _httpRequests?: Counter;
  private _httpDuration?: Histogram;
  private _httpActive?: UpDownCounter;
  private _processUptime?: Gauge;
  private _processRss?: Gauge;
  private _heapUsed?: Gauge;
  private _heapTotal?: Gauge;
  private _externalMemory?: Gauge;
  private _eventLoopDelay?: Gauge;
  private _activeContexts?: Gauge;
  private _failures?: Counter;
  private _enabled = false;

  get enabled() {
    return this._enabled;
  }

  init() {
    if (this._provider || this._enabled) return;
    const config = this.scope.config;
    if (!config.enabled) return;
    try {
      const exporter = new OTLPMetricExporter({
        url: config.exporter.url,
        headers: config.exporter.headers,
      });
      const reader = new PeriodicExportingMetricReader({
        exporter,
        exportIntervalMillis: config.exporter.exportIntervalMillis,
        exportTimeoutMillis: config.exporter.exportTimeoutMillis,
        cardinalityLimits: { counter: 1000, histogram: 1000, upDownCounter: 1000 },
      });
      this._provider = new MeterProvider({
        resource: resourceFromAttributes({
          'service.name': config.serviceName,
          'service.instance.id': `${process.pid}`,
          'deployment.environment.name': this.app.config.meta.mode,
          'process.pid': process.pid,
        }),
        readers: [reader],
        views: [
          {
            instrumentName: 'http.server.request.duration',
            aggregation: {
              type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM,
              options: { boundaries: [...METRICS_HTTP_DURATION_BUCKETS] },
            },
            aggregationCardinalityLimit: 1000,
          },
        ],
      });
      this._meter = this._provider.getMeter('vona-module-a-metrics');
      this._httpRequests = this._meter.createCounter('http.server.request.count', {
        description: 'Completed Vona HTTP requests',
        unit: '{request}',
      });
      this._httpDuration = this._meter.createHistogram('http.server.request.duration', {
        description: 'Vona HTTP request duration',
        unit: 's',
      });
      this._httpActive = this._meter.createUpDownCounter('vona.http.server.active_requests', {
        description: 'Active Vona HTTP requests',
        unit: '{request}',
      });
      this._processUptime = this._meter.createGauge('vona.process.uptime', {
        description: 'Vona worker process uptime',
        unit: 's',
      });
      this._processRss = this._meter.createGauge('vona.process.rss', {
        description: 'Vona worker resident memory',
        unit: 'By',
      });
      this._heapUsed = this._meter.createGauge('vona.nodejs.heap.used', {
        description: 'Vona worker used heap memory',
        unit: 'By',
      });
      this._heapTotal = this._meter.createGauge('vona.nodejs.heap.total', {
        description: 'Vona worker total heap memory',
        unit: 'By',
      });
      this._externalMemory = this._meter.createGauge('vona.nodejs.external_memory', {
        description: 'Vona worker external memory',
        unit: 'By',
      });
      this._eventLoopDelay = this._meter.createGauge('vona.process.event_loop.delay.max', {
        description: 'Vona worker maximum event loop delay',
        unit: 's',
      });
      this._activeContexts = this._meter.createGauge('vona.context.active', {
        description: 'Active Vona contexts',
        unit: '{context}',
      });
      this._failures = this._meter.createCounter('vona.metrics.observation.failures', {
        description: 'Metrics observation failures',
        unit: '{failure}',
      });
      this._enabled = true;
    } catch (err) {
      this.$logger.warn({
        event: 'metrics.init_failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  recordHttpStart() {
    if (!this._enabled) return;
    try {
      this._httpActive?.add(1);
    } catch {
      this.recordFailure('http');
    }
  }

  recordHttpRequest(request: IMetricsHttpRequest) {
    if (!this._enabled) return;
    try {
      const attributes = {
        'http.request.method': request.method.toUpperCase(),
        'http.route': request.route,
        'http.response.status_code': request.statusCode,
        'vona.http.aborted': request.aborted,
      };
      this._httpRequests?.add(1, attributes);
      this._httpDuration?.record(request.durationSeconds, attributes);
    } catch {
      this.recordFailure('http');
    } finally {
      this.recordHttpEnd();
    }
  }

  recordHttpEnd() {
    if (!this._enabled) return;
    try {
      this._httpActive?.add(-1);
    } catch {
      this.recordFailure('http');
    }
  }

  recordRuntime({
    uptimeSeconds,
    rssBytes,
    heapUsedBytes,
    heapTotalBytes,
    externalBytes,
    eventLoopDelayMaxSeconds,
    activeContexts,
  }: {
    uptimeSeconds: number;
    rssBytes: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
    externalBytes: number;
    eventLoopDelayMaxSeconds: number;
    activeContexts: number;
  }) {
    if (!this._enabled) return;
    try {
      this._processUptime?.record(uptimeSeconds);
      this._processRss?.record(rssBytes);
      this._heapUsed?.record(heapUsedBytes);
      this._heapTotal?.record(heapTotalBytes);
      this._externalMemory?.record(externalBytes);
      this._eventLoopDelay?.record(eventLoopDelayMaxSeconds);
      this._activeContexts?.record(activeContexts);
    } catch {
      this.recordFailure('runtime');
    }
  }

  recordFailure(component: 'http' | 'runtime' | 'queue') {
    try {
      this._failures?.add(1, { component });
    } catch {}
  }

  async close(forceFlush: boolean) {
    if (!this._provider) return;
    try {
      await withTimeout(
        forceFlush ? this._provider.forceFlush() : this._provider.shutdown(),
        this.scope.config.shutdown.timeoutMillis,
      );
    } catch (err) {
      this.$logger.warn({
        event: 'metrics.shutdown_failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

async function withTimeout(promise: Promise<void>, timeoutMillis: number) {
  await Promise.race([
    promise,
    new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('metrics shutdown timed out')), timeoutMillis).unref();
    }),
  ]);
}
