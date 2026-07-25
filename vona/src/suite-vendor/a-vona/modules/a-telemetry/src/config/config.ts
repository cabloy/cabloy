import type { VonaApplication } from 'vona';

interface TelemetryEnv {
  TELEMETRY_ENABLED?: string;
  TELEMETRY_SERVICE_NAME?: string;
  TELEMETRY_SAMPLING_ROOT_RATIO?: string;
  TELEMETRY_OTLP_HTTP_URL?: string;
  TELEMETRY_OTLP_HTTP_HEADERS?: string;
  TELEMETRY_EXPORT_MAX_QUEUE_SIZE?: string;
  TELEMETRY_EXPORT_DELAY_MS?: string;
  TELEMETRY_EXPORT_TIMEOUT_MS?: string;
  TELEMETRY_SHUTDOWN_TIMEOUT_MS?: string;
}

export function config(app: VonaApplication) {
  const env = app.meta.env as TelemetryEnv;
  return {
    enabled: env.TELEMETRY_ENABLED === 'true',
    serviceName: env.TELEMETRY_SERVICE_NAME || app.name,
    requestIdHeader: 'x-request-id',
    sampling: {
      rootRatio: Number.parseFloat(env.TELEMETRY_SAMPLING_ROOT_RATIO || '0.1'),
    },
    exporter: {
      url: env.TELEMETRY_OTLP_HTTP_URL || 'http://127.0.0.1:4318/v1/traces',
      headers: parseHeaders(env.TELEMETRY_OTLP_HTTP_HEADERS),
      maxQueueSize: Number.parseInt(env.TELEMETRY_EXPORT_MAX_QUEUE_SIZE || '2048'),
      scheduledDelayMillis: Number.parseInt(env.TELEMETRY_EXPORT_DELAY_MS || '5000'),
      exportTimeoutMillis: Number.parseInt(env.TELEMETRY_EXPORT_TIMEOUT_MS || '30000'),
    },
    shutdown: {
      timeoutMillis: Number.parseInt(env.TELEMETRY_SHUTDOWN_TIMEOUT_MS || '5000'),
    },
  };
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
