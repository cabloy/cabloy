import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsWebhookReceipt extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsWebhookReceipt>()
export class DtoWebhookReceipt {
  @Api.field(v.required())
  accepted: true;
}
