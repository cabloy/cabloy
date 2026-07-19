import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsCommerceAdmin } from 'vona-module-commerce-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsStockBalance extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsStockBalance>({
  items: {
    stockBalance: {
      title: $locale('StockBalance'),
      order: $order(1),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-trade:stockBalance',
        },
      },
      group: 'commerce-siteadmin:inventory',
      roles: ['systemAdmin'],
    },
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuStockBalance extends BeanBase {}
