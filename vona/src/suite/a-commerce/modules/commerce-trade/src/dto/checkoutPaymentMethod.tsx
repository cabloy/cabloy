import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';

export interface IDtoOptionsCheckoutPaymentMethod extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCheckoutPaymentMethod>()
export class DtoCheckoutPaymentMethod {
  @Api.field(v.required(), v.min(1), v.max(100))
  key: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  label: string;

  @Api.field(z.enum(['redirect', 'embedded']))
  interaction: 'redirect' | 'embedded';
}
