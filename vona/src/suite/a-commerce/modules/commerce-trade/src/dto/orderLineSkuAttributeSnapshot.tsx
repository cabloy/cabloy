import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

export interface IDtoOptionsOrderLineSkuAttributeSnapshot extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsOrderLineSkuAttributeSnapshot>()
export class DtoOrderLineSkuAttributeSnapshot {
  @Api.field(v.required())
  name: string;

  @Api.field(v.required())
  value: string;
}
