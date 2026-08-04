import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { couponTemplateStateItems } from '../entity/couponTemplate.tsx';

export interface IDtoOptionsCouponTemplateUpdate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateUpdate>({
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
                    title: $locale('BasicInformation'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'name' },
                          { type: 'field', name: 'state' },
                          { type: 'field', name: 'description', span: { default: 1, md: 2 } },
                        ],
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
export class DtoCouponTemplateUpdate {
  @Api.field(v.optional(), v.min(2), v.max(100))
  name?: string;

  @Api.field(
    v.optional(),
    ZovaRender.field('basic-select:formFieldSelect', { items: couponTemplateStateItems }),
    z.enum(['draft', 'active', 'disabled']),
  )
  state?: 'draft' | 'active' | 'disabled';

  @Api.field(v.optional(), v.max(255))
  description?: string;
}
