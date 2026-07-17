import type { IDecoratorSsrMenuOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { $order } from 'vona-module-a-openapiutils';
import { SsrMenu } from 'vona-module-a-ssr';

import type { ISsrSiteOptionsCommerceAdmin } from './ssrSite.commerceAdmin.ts';

export interface ISsrMenuOptionsHome extends IDecoratorSsrMenuOptions<ISsrSiteOptionsCommerceAdmin> {}

@SsrMenu<ISsrMenuOptionsHome>({
  item: {
    title: 'Commerce Administration',
    order: $order(1),
    icon: undefined,
    link: '/',
    roles: ['systemAdmin'],
  },
  site: ['commerce-siteadmin:commerceAdmin'],
})
export class SsrMenuHome extends BeanBase {}
