import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRefundReview extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundReview>()
export class DtoRefundReview {
  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  idempotencyKey: string;
}
