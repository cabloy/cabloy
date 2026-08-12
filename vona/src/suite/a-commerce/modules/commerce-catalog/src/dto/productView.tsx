import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelProduct } from '../model/product.ts';

export interface IDtoOptionsProductView extends IDecoratorDtoOptions<'productContentForm'> {}

@Dto<IDtoOptionsProductView>({
  fields: {
    productContentForm: $makeMetadata(
      ZovaRender.fieldSource('productContentForm.descriptionMarkdown'),
      ZovaRender.field('commerce-catalog:formFieldMarkdown'),
    ),
  },
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoProductView extends $Dto.get(() => ModelProduct, {
  include: {
    category: true,
    productContentForm: true,
  },
}) {}
