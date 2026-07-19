import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsCommerceAdmin } from './ssrSite.commerceAdmin.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuGroupOptionsInventory extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenuGroup<ISsrMenuGroupOptionsInventory>({
  item: {
    title: $locale('Inventory'),
    order: $order(3),
    icon: undefined,
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuGroupInventory extends BeanBase {}
