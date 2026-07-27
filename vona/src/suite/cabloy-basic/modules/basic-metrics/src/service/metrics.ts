import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoMetricsSnapshot } from '../dto/metricsSnapshot.ts';

@Service()
export class ServiceMetrics extends BeanBase {
  snapshot(): DtoMetricsSnapshot {
    return this.bean.metrics.snapshot();
  }
}
