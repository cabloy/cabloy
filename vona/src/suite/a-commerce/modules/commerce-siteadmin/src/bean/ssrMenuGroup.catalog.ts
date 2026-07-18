import type { IDecoratorSsrMenuGroupOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenuGroup } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsCommerceAdmin } from './ssrSite.commerceAdmin.ts';

import { $locale } from '../.metadata/locales.ts';

export interface ISsrMenuGroupOptionsCatalog extends IDecoratorSsrMenuGroupOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenuGroup<ISsrMenuGroupOptionsCatalog>({
  item: {
    title: $locale('Catalog'),
    order: $order(2),
    icon: undefined,
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuGroupCatalog extends BeanBase {}
