import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRefundOutcomeCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundOutcomeCreate>()
export class DtoRefundOutcomeCreate {
  @Api.field(z.enum(['succeeded', 'failed']))
  outcome: 'succeeded' | 'failed';

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;
}
