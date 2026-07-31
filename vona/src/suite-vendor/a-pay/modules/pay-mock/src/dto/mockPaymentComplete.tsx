import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsMockPaymentComplete extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMockPaymentComplete>()
export class DtoMockPaymentComplete {
  @Api.field(z.enum(['succeeded', 'failed', 'cancelled']))
  outcome: 'succeeded' | 'failed' | 'cancelled';
}
