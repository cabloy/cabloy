import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsCommerceAdmin } from 'vona-module-commerce-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsOrder extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsOrder>({
  items: {
    order: {
      title: $locale('Order'),
      order: $order(3),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-trade:order',
        },
      },
      group: 'commerce-siteadmin:inventory',
      roles: ['systemAdmin'],
    },
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuOrder extends BeanBase {}
