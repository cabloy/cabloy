import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import z from 'zod';

export interface IDtoOptionsMetricsQueue extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMetricsQueue>()
export class DtoMetricsQueue {
  @Api.field()
  name: string;

  @Api.field()
  state: string;

  @Api.field(v.optional())
  observedAt?: string;

  @Api.field(v.optional(), z.record(z.string(), z.number()))
  jobs?: Record<string, number>;

  @Api.field(v.optional())
  schedulers?: number;
}
