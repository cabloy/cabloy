import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoImageTransformOptions } from './imageTransformOptions.tsx';

export interface IDtoOptionsImageDeliveryRequest extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsImageDeliveryRequest>()
export class DtoImageDeliveryRequest {
  @Api.field(v.optional())
  variantName?: string;

  @Api.field(v.optional(), v.object(DtoImageTransformOptions))
  transformOptions?: Record<string, unknown>;

  @Api.field(v.optional())
  token?: string;
}
