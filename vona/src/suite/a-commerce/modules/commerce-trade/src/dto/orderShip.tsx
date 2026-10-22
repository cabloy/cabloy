import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsOrderShip extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderShip>()
export class DtoOrderShip {
  @Api.field(v.title($locale('Carrier')), v.required(), v.min(1), v.max(100), v.regex(/\S/))
  carrier: string;

  @Api.field(v.title($locale('TrackingNumber')), v.required(), v.min(1), v.max(100), v.regex(/\S/))
  trackingNumber: string;
}
