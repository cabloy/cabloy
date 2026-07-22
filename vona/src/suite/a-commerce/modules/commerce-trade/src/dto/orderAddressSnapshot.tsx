import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsOrderAddressSnapshot extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderAddressSnapshot>()
export class DtoOrderAddressSnapshot {
  @Api.field(v.required())
  recipientName: string;

  @Api.field(v.required())
  phone: string;

  @Api.field(v.required())
  countryCode: string;

  @Api.field(v.required())
  region: string;

  @Api.field(v.required())
  city: string;

  @Api.field(v.required())
  postalCode: string;

  @Api.field(v.required())
  addressLine1: string;

  @Api.field(v.optional())
  addressLine2?: string;
}
