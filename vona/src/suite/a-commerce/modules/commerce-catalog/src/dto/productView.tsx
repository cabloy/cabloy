import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelProduct } from '../model/product.ts';

export interface IDtoOptionsProductView extends IDecoratorDtoOptions<'productContentForm'> {}

@Dto<IDtoOptionsProductView>({
  fields: {
    productContentForm: $makeMetadata(
      ZovaRender.fieldSource('productContentForm.descriptionMarkdown'),
      ZovaRender.field('basic-markdown:formFieldMarkdown'),
    ),
  },
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      pageTitleKey: 'title',
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('basic-form:blockFormLayout', {
              formLayout: {
                children: [
                  {
                    type: 'group',
                    title: $locale('Product'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'id' },
                          { type: 'field', name: 'title' },
                          { type: 'field', name: 'categoryId' },
                          { type: 'field', name: 'published' },
                          { type: 'field', name: 'description', span: { default: 1, md: 2 } },
                          { type: 'field', name: 'createdAt' },
                          { type: 'field', name: 'updatedAt' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('ProductContent'),
                    children: [
                      {
                        type: 'section',
                        children: [{ type: 'field', name: 'productContentForm' }],
                      },
                    ],
                  },
                ],
              },
            }),
          ],
        }),
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
