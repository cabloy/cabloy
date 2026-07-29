import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsWebhookReceipt extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsWebhookReceipt>()
export class DtoWebhookReceipt {}
