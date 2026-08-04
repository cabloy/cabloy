import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsMockRefundComplete extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsMockRefundComplete>()
export class DtoMockRefundComplete {
  @Api.field(z.enum(['succeeded', 'failed', 'cancelled']))
  outcome: 'succeeded' | 'failed' | 'cancelled';
}
