import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsMetricsRuntime extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMetricsRuntime>()
export class DtoMetricsRuntime {
  @Api.field()
  state: string;

  @Api.field(v.optional())
  observedAt?: string;

  @Api.field(v.optional())
  uptimeSeconds?: number;

  @Api.field(v.optional())
  rssBytes?: number;

  @Api.field(v.optional())
  heapUsedBytes?: number;

  @Api.field(v.optional())
  heapTotalBytes?: number;

  @Api.field(v.optional())
  externalBytes?: number;

  @Api.field(v.optional())
  eventLoopDelayMaxSeconds?: number;

  @Api.field(v.optional())
  activeContexts?: number;
}
