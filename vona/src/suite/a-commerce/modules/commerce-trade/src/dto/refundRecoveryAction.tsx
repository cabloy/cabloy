import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsRefundRecoveryAction extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundRecoveryAction>()
export class DtoRefundRecoveryAction {
  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  actionIdempotencyKey: string;

  @Api.field(v.optional(), z.boolean())
  acknowledgeRetryRisk?: boolean;
}
