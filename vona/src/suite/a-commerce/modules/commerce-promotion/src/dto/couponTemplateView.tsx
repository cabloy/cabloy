import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelCouponTemplate } from '../model/couponTemplate.ts';

export interface IDtoOptionsCouponTemplateView extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsCouponTemplateView>({
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
                          { type: 'field', name: 'issuedCount' },
                          { type: 'field', name: 'redeemedCount' },
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
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoCouponTemplateView extends $Dto.get(() => ModelCouponTemplate) {}
