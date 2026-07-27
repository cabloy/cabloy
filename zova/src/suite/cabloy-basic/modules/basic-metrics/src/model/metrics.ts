import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsMetrics extends IDecoratorModelOptions {}

@Model<IModelOptionsMetrics>()
export class ModelMetrics extends BeanModelBase {
  snapshot() {
    return this.$useStateData({
      queryKey: ['basicMetricsSnapshot'],
      queryFn: async () => await this.scope.api.basicMetricsMetrics.snapshot(),
      staleTime: 15000,
    });
  }
}
