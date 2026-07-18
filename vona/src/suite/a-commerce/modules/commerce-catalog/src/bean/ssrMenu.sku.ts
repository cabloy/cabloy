import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsCommerceAdmin } from 'vona-module-commerce-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsSku extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsSku>({
  items: {
    sku: {
      title: $locale('Sku'),
      order: $order(3),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-catalog:sku',
        },
      },
      group: 'commerce-siteadmin:catalog',
      roles: ['systemAdmin'],
    },
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuSku extends BeanBase {}
