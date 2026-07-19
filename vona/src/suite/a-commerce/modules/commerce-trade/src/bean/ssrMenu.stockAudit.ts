import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';
import type { ISsrSiteOptionsCommerceAdmin } from 'vona-module-commerce-siteadmin';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuOptionsStockAudit extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsStockAudit>({
  items: {
    stockAudit: {
      title: $locale('StockAudit'),
      order: $order(2),
      icon: undefined,
      link: 'presetResource',
      meta: {
        params: {
          resource: 'commerce-trade:stockAudit',
        },
      },
      group: 'commerce-siteadmin:inventory',
      roles: ['systemAdmin'],
    },
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuStockAudit extends BeanBase {}
