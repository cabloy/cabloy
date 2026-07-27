export const METRICS_HTTP_DURATION_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30,
] as const;

export const METRICS_QUEUE_STATES = [
  'active',
  'completed',
  'delayed',
  'failed',
  'paused',
  'prioritized',
  'waiting',
  'waiting-children',
] as const;

export type TypeMetricsSectionState = 'disabled' | 'fresh' | 'stale' | 'unavailable';

export interface IMetricsHttpRequest {
  method: string;
  route: string;
  statusCode: number;
  durationSeconds: number;
  aborted: boolean;
}

export interface IMetricsQueueSnapshot {
  name: string;
  state: TypeMetricsSectionState;
  observedAt?: string;
  jobs?: Partial<Record<(typeof METRICS_QUEUE_STATES)[number], number>>;
  schedulers?: number;
}

export interface IMetricsRuntimeSnapshot {
  state: TypeMetricsSectionState;
  observedAt?: string;
  uptimeSeconds?: number;
  rssBytes?: number;
  heapUsedBytes?: number;
  heapTotalBytes?: number;
  externalBytes?: number;
  eventLoopDelayMaxSeconds?: number;
  activeContexts?: number;
}

export interface IMetricsSnapshot {
  enabled: boolean;
  runtime: IMetricsRuntimeSnapshot;
  queues: IMetricsQueueSnapshot[];
}
