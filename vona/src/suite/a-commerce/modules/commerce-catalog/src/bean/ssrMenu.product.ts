import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsCommerceAdmin } from 'vona-module-commerce-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsProduct extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsProduct>({
  items: {
    product: {
      title: $locale('Product'),
      order: $order(2),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-catalog:product',
        },
      },
      group: 'commerce-siteadmin:catalog',
      roles: ['systemAdmin'],
    },
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuProduct extends BeanBase {}
