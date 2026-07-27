import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IMetricsSnapshot } from '../types/metrics.ts';

@Bean()
export class BeanMetrics extends BeanBase {
  get enabled() {
    return this.scope.service.metrics.enabled;
  }

  snapshot(): IMetricsSnapshot {
    return this.scope.service.metricsRuntime.snapshot();
  }
}
