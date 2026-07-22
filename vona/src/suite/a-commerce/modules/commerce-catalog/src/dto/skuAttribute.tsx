import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsSkuAttribute extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSkuAttribute>()
export class DtoSkuAttribute {
  @Api.field(v.title($locale('SkuAttributeName')), v.required(), v.min(1), v.max(100))
  name: string;

  @Api.field(v.title($locale('SkuAttributeValue')), v.required(), v.min(1), v.max(255))
  value: string;
}
