import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';
import { z } from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsCouponTemplateCreate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateCreate>({
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
                  {
                    type: 'group',
                    title: $locale('DiscountPolicy'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'currency' },
                          { type: 'field', name: 'discountCents' },
                          { type: 'field', name: 'minSpendCents' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('ValidityWindow'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'validFrom' },
                          { type: 'field', name: 'validUntil' },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'group',
                    title: $locale('UsageLimits'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'totalIssueLimit' },
                          { type: 'field', name: 'totalUsageLimit' },
                          { type: 'field', name: 'perCustomerIssueLimit' },
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
export class DtoCouponTemplateCreate {
  @Api.field(v.required(), v.min(2), v.max(100))
  name: string;

  @Api.field(v.required(), z.enum(['draft', 'active']))
  state: 'draft' | 'active';

  @Api.field(v.required(), z.literal('USD'))
  currency: 'USD';

  @Api.field(v.required(), z.number().int().positive())
  discountCents: number;

  @Api.field(v.required(), z.number().int().nonnegative())
  minSpendCents: number;

  @Api.field(v.required())
  validFrom: Date;

  @Api.field(v.required())
  validUntil: Date;

  @Api.field(v.optional(), z.number().int().positive())
  totalIssueLimit?: number;

  @Api.field(v.optional(), z.number().int().positive())
  totalUsageLimit?: number;

  @Api.field(v.optional(), z.number().int().positive())
  perCustomerIssueLimit?: number;

  @Api.field(v.optional(), v.max(255))
  description?: string;
}
