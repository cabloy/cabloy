import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsPaymentSessionStart extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPaymentSessionStart>()
export class DtoPaymentSessionStart {}
