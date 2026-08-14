import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';
import { DtoProductPublic } from './productPublic.tsx';

export interface IDtoOptionsProductPublicDetail extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductPublicDetail>()
export class DtoProductPublicDetail extends DtoProductPublic {
  @Api.field(v.title($locale('DescriptionHtml')), v.optional())
  descriptionHtml?: string;
}
