import type { VonaApplication } from 'vona';

interface MetricsEnv {
  METRICS_ENABLED?: string;
  METRICS_SERVICE_NAME?: string;
  METRICS_OTLP_HTTP_URL?: string;
  METRICS_OTLP_HTTP_HEADERS?: string;
  METRICS_EXPORT_INTERVAL_MS?: string;
  METRICS_EXPORT_TIMEOUT_MS?: string;
  METRICS_RUNTIME_INTERVAL_MS?: string;
  METRICS_QUEUE_INTERVAL_MS?: string;
  METRICS_QUEUE_CONCURRENCY?: string;
  METRICS_QUEUE_TIMEOUT_MS?: string;
  METRICS_SNAPSHOT_CACHE_MS?: string;
  METRICS_SHUTDOWN_TIMEOUT_MS?: string;
}

export interface IMetricsConfig {
  enabled: boolean;
  serviceName: string;
  exporter: {
    url: string;
    headers?: Record<string, string>;
    exportIntervalMillis: number;
    exportTimeoutMillis: number;
  };
  runtime: { intervalMillis: number };
  queue: { intervalMillis: number; concurrency: number; timeoutMillis: number };
  snapshot: { cacheMillis: number };
  shutdown: { timeoutMillis: number };
}

export function config(app: VonaApplication): IMetricsConfig {
  const env = app.meta.env as MetricsEnv;
  return {
    enabled: env.METRICS_ENABLED === 'true',
    serviceName: env.METRICS_SERVICE_NAME || app.name,
    exporter: {
      url: env.METRICS_OTLP_HTTP_URL || 'http://127.0.0.1:4318/v1/metrics',
      headers: parseHeaders(env.METRICS_OTLP_HTTP_HEADERS),
      exportIntervalMillis: parseInteger(env.METRICS_EXPORT_INTERVAL_MS, 15000, 1000, 60000),
      exportTimeoutMillis: parseInteger(env.METRICS_EXPORT_TIMEOUT_MS, 10000, 1000, 30000),
    },
    runtime: {
      intervalMillis: parseInteger(env.METRICS_RUNTIME_INTERVAL_MS, 15000, 1000, 60000),
    },
    queue: {
      intervalMillis: parseInteger(env.METRICS_QUEUE_INTERVAL_MS, 30000, 5000, 300000),
      concurrency: parseInteger(env.METRICS_QUEUE_CONCURRENCY, 4, 1, 16),
      timeoutMillis: parseInteger(env.METRICS_QUEUE_TIMEOUT_MS, 5000, 500, 30000),
    },
    snapshot: {
      cacheMillis: parseInteger(env.METRICS_SNAPSHOT_CACHE_MS, 5000, 1000, 30000),
    },
    shutdown: {
      timeoutMillis: parseInteger(env.METRICS_SHUTDOWN_TIMEOUT_MS, 4000, 500, 5000),
    },
  };
}

function parseInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function parseHeaders(value?: string) {
  if (!value) return undefined;
  return Object.fromEntries(
    value
      .split(',')
      .map(item => item.trim().split('='))
      .filter(([key, headerValue]) => key && headerValue),
  );
}
