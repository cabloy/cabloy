import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsRefundRequestCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRefundRequestCreate>()
export class DtoRefundRequestCreate {
  @Api.field(v.required(), v.min(1), v.max(255))
  reason: string;
}
