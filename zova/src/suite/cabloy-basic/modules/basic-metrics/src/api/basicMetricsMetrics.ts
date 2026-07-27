import type { IApiActionOptions } from 'zova-module-a-api';

import { Api, BeanApiBase } from 'zova-module-a-api';

export interface IMetricsRuntimeSnapshot {
  state: 'disabled' | 'fresh' | 'stale' | 'unavailable';
  observedAt?: string;
  uptimeSeconds?: number;
  rssBytes?: number;
  heapUsedBytes?: number;
  heapTotalBytes?: number;
  externalBytes?: number;
  eventLoopDelayMaxSeconds?: number;
  activeContexts?: number;
}

export interface IMetricsQueueSnapshot {
  name: string;
  state: 'disabled' | 'fresh' | 'stale' | 'unavailable';
  observedAt?: string;
  jobs?: Record<string, number>;
  schedulers?: number;
}

export interface IMetricsSnapshot {
  enabled: boolean;
  runtime: IMetricsRuntimeSnapshot;
  queues: IMetricsQueueSnapshot[];
}

export const ApiBasicMetricsMetricsSnapshotPath = '/api/basic/metrics/snapshot';

@Api()
export class ApiBasicMetricsMetrics extends BeanApiBase {
  snapshot(options?: IApiActionOptions) {
    return this.$fetch.get<any, IMetricsSnapshot>(
      ApiBasicMetricsMetricsSnapshotPath,
      this.$configPrepare(undefined, options, true),
    );
  }
}
