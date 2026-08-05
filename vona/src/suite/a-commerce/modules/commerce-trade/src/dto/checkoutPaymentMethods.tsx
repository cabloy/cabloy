import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoCheckoutPaymentMethod } from './checkoutPaymentMethod.tsx';

export interface IDtoOptionsCheckoutPaymentMethods extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCheckoutPaymentMethods>()
export class DtoCheckoutPaymentMethods {
  @Api.field(v.array(DtoCheckoutPaymentMethod))
  items: DtoCheckoutPaymentMethod[];

  @Api.field(v.required(), v.min(1), v.max(100))
  defaultKey: string;
}
