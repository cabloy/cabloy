import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsProductContentUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductContentUpdate>()
export class DtoProductContentUpdate {
  @Api.field(v.title($locale('DescriptionMarkdown')), v.optional())
  descriptionMarkdown?: string;
}
