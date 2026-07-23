import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsPaymentOutcomeCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaymentOutcomeCreate>()
export class DtoPaymentOutcomeCreate {
  @Api.field(z.enum(['succeeded', 'failed', 'cancelled']))
  outcome: 'succeeded' | 'failed' | 'cancelled';

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;
}
