import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelProduct } from '../model/product.ts';

export interface IDtoOptionsProductCreate extends IDecoratorDtoOptions<'productContentForm'> {}

@Dto<IDtoOptionsProductCreate>({
  fields: {
    productContentForm: $makeMetadata(
      ZovaRender.fieldSource('productContentForm.descriptionMarkdown'),
      ZovaRender.field('commerce-catalog:formFieldMarkdown'),
    ),
  },
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
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
                          { type: 'field', name: 'title' },
                          { type: 'field', name: 'categoryId' },
                          { type: 'field', name: 'published' },
                          { type: 'field', name: 'description', span: { default: 1, md: 2 } },
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
            ZovaRender.formActionRow('basic-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoProductCreate extends $Dto.create(() => ModelProduct, {
  include: { productContentForm: true },
}) {}
