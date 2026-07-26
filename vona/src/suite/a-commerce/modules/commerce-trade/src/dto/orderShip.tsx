import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsOrderShip extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderShip>()
export class DtoOrderShip {
  @Api.field(v.required(), v.min(1), v.max(100))
  carrier: string;

  @Api.field(v.required(), v.min(1), v.max(100))
  trackingNumber: string;
}
