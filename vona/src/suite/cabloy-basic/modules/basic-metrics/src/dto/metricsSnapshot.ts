import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoMetricsQueue } from './metricsQueue.ts';
import { DtoMetricsRuntime } from './metricsRuntime.ts';

export interface IDtoOptionsMetricsSnapshot extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMetricsSnapshot>()
export class DtoMetricsSnapshot {
  @Api.field()
  enabled: boolean;

  @Api.field()
  runtime: DtoMetricsRuntime;

  @Api.field(v.array(DtoMetricsQueue))
  queues: DtoMetricsQueue[];
}
