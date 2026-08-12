import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsProductContentView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsProductContentView>({
  fields: {
    descriptionMarkdown: $makeMetadata(ZovaRender.field('commerce-catalog:formFieldMarkdown')),
  },
})
export class DtoProductContentView {
  @Api.field(v.title($locale('DescriptionMarkdown')), v.optional())
  descriptionMarkdown?: string;
}
